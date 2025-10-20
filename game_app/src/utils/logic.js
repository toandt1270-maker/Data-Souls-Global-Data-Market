import { randomItem, clamp } from "./helpers.js";
import { applyBalanceAdjustments } from "./balance.js";

// Load data from JSON files using dynamic import to avoid browser compatibility issues
let scenarios = [];
let stakeholders = [];
let events = [];

// Initialize data asynchronously
async function loadGameData() {
  try {
    const [scenariosData, stakeholdersData, eventsData] = await Promise.all([
      fetch(new URL('../data/scenarios.json', import.meta.url)).then(r => r.json()),
      fetch(new URL('../data/stakeholders.json', import.meta.url)).then(r => r.json()),
      fetch(new URL('../data/events.json', import.meta.url)).then(r => r.json())
    ]);
    
    scenarios = scenariosData;
    stakeholders = stakeholdersData;
    events = eventsData;
    
    console.log(`✅ Loaded ${scenarios.length} scenarios, ${stakeholders.length} stakeholders, ${events.length} events`);
  } catch (error) {
    console.error("Failed to load game data:", error);
    // Fallback to minimal data
    scenarios = [
      {
        "id": "s1",
        "title": "AI Surveillance in Schools",
        "category": "education",
        "desc": "A startup wants to analyze student emotions using facial recognition to improve learning.",
        "decisions": {
          "approve": { "innovation": 5, "profit": 4, "trust": -6, "ethics": -7, "consequence": "Schools become digital prisons." },
          "delay": { "innovation": 1, "profit": 0, "trust": 2, "ethics": 2, "consequence": "Ethics review commissioned." },
          "reject": { "innovation": -3, "profit": -4, "trust": 5, "ethics": 6, "consequence": "Privacy protected, innovation slows." }
        },
        "tags": ["privacy", "education"]
      }
    ];
    stakeholders = [
      {
        "id": "public",
        "name": "The Public",
        "concern": "trust",
        "mod": { "trust": 2, "ethics": 1 },
        "mod_negative": { "trust": -2, "ethics": -1 },
        "flavor": "Citizens watch your every move.",
        "reaction_positive": "Public support grows.",
        "reaction_negative": "Mass protest organized."
      }
    ];
    events = [];
  }
}

// Call immediately when module loads
loadGameData();

export function initGameState() {
  return {
    round: 1,
    maxRounds: Infinity, // No limit - play until collapse
    stats: { innovation: 50, profit: 50, trust: 50, ethics: 50 },
    history: [],
    decisionHistory: [], // Track decisions for AI analysis
    currentScenario: null,
    lastCommentary: null, // Store last AI commentary
    stakeholderSatisfaction: {
      investor: 50,
      regulator: 50,
      public: 50,
      visionary: 50
    }, // Track relationship with each stakeholder
  };
}

export function pickScenario(round) {
  if (round % 3 === 0) {
    const trade = scenarios.filter(s => s.category === "data_trade");
    return randomItem(trade);
  }
  return randomItem(scenarios);
}

export function rollStakeholder() {
  return randomItem(stakeholders);
}

export function applyDecision(state, decision, stakeholder) {
  const scn = state.currentScenario;
  const base = scn.decisions[decision];
  const mod = stakeholder ? stakeholder.mod : {};
  
  // Calculate impact for AI analysis
  const impact = {};
  for (const k of ["innovation", "profit", "trust", "ethics"]) {
    const delta = (base[k] || 0) + (mod[k] || 0);
    impact[k] = delta;
    state.stats[k] = clamp(state.stats[k] + delta, 0, 100);
  }

  applyBalanceAdjustments(state);
  
  state.history.unshift({
    round: state.round,
    scenario: scn.title,
    decision,
  });
  
  // Track decision for AI commentary
  
  state.decisionHistory.push(decision);
  
  // Store decision context for AI
  state.lastDecisionContext = {
    title: scn.title,
    decision: decision,
    impact: impact,
    stakeholder: stakeholder?.name,
  };
}

/**
 * Check if random events should trigger based on current stats
 * Events are probability-weighted by metric imbalances
 */
export function maybeEvent(state) {
  const { innovation, profit, trust, ethics } = state.stats;
  
  // Check each event's trigger conditions
  for (const event of events) {
    if (checkEventTrigger(event, state)) {
      applyEvent(state, event);
      return event; // Return the triggered event
    }
  }
  
  return null; // No event triggered
}

/**
 * Check if an event's trigger conditions are met
 */
function checkEventTrigger(event, state) {
  const { innovation, profit, trust, ethics } = state.stats;
  const trigger = event.trigger;
  
  // Check each condition in the trigger
  if (trigger.ethics) {
    const [op, val] = parseTrigger(trigger.ethics);
    if (!evaluateCondition(ethics, op, val)) return false;
  }
  
  if (trigger.trust) {
    const [op, val] = parseTrigger(trigger.trust);
    if (!evaluateCondition(trust, op, val)) return false;
  }
  
  if (trigger.innovation) {
    const [op, val] = parseTrigger(trigger.innovation);
    if (!evaluateCondition(innovation, op, val)) return false;
  }
  
  if (trigger.profit) {
    const [op, val] = parseTrigger(trigger.profit);
    if (!evaluateCondition(profit, op, val)) return false;
  }
  
  // Check probability (increased from 0.3 to 0.5 for more frequent events)
  const probability = trigger.probability || 0.5;
  return Math.random() < probability;
}

/**
 * Parse trigger string like "<30" or ">70"
 */
function parseTrigger(triggerStr) {
  if (typeof triggerStr === 'string') {
    if (triggerStr.startsWith('<')) {
      return ['<', parseFloat(triggerStr.substring(1))];
    }
    if (triggerStr.startsWith('>')) {
      return ['>', parseFloat(triggerStr.substring(1))];
    }
  }
  return ['>', 0]; // Default
}

/**
 * Evaluate condition: value op threshold
 */
function evaluateCondition(value, op, threshold) {
  if (op === '<') return value < threshold;
  if (op === '>') return value > threshold;
  return false;
}

/**
 * Apply event effects to game state
 */
function applyEvent(state, event) {
  for (const k of ["innovation", "profit", "trust", "ethics"]) {
    if (event.effect[k]) {
      state.stats[k] = clamp(state.stats[k] + event.effect[k], 0, 100);
    }
  }
  
  // Store event in history
  if (!state.triggeredEvents) {
    state.triggeredEvents = [];
  }
  state.triggeredEvents.push({
    round: state.round,
    eventId: event.id,
    title: event.title
  });
}

/**
 * Check if any metric has collapsed (reached critical threshold) causing instant game over
 */
export function checkGameOver(state) {
  const { innovation, profit, trust, ethics } = state.stats;
  
  // Critical threshold: <= 10 triggers game over
  if (ethics <= 10) {
    return {
      isGameOver: true,
      reason: "SCANDAL",
      title: "⚖️ Immediate Scandal!",
      message: "Legal collapse due to ethical violations. The Global AI Ethics Council has been dissolved by international authorities. Your governance has failed."
    };
  }
  
  if (trust <= 10) {
    return {
      isGameOver: true,
      reason: "UPRISING",
      title: "🤝 Civil Uprising!",
      message: "Widespread protests and digital boycotts have eroded all governing power. Citizens have lost faith in the Council's ability to protect their interests."
    };
  }
  
  if (profit <= 10) {
    return {
      isGameOver: true,
      reason: "RECESSION",
      title: "💰 Financial Collapse!",
      message: "The Council has run out of operating funds. Without economic support, all AI governance initiatives have been suspended indefinitely."
    };
  }
  
  if (innovation <= 10) {
    return {
      isGameOver: true,
      reason: "STAGNATION",
      title: "💡 Global Stagnation!",
      message: "Technological breakthroughs have ceased entirely. Your conservative approach has left the world unable to compete, leading to economic decline."
    };
  }
  
  return { isGameOver: false };
}

/**
 * Compute final ending based on metric balance at Round 12
 */
export function computeEnding(state) {
  const { innovation: i, profit: p, trust: t, ethics: e } = state.stats;
  
  // Calculate balance metrics
  const avg = (i + p + t + e) / 4;
  const allInRange = [i, p, t, e].every(v => v >= 65 && v <= 85);
  const maxDiff = Math.max(i, p, t, e) - Math.min(i, p, t, e);
  
  // THE BALANCED ONE (Optimal - Hardest to achieve)
  if (allInRange && maxDiff <= 20) {
    return {
      title: "⚖️ The Balanced One",
      description: "The rarest achievement: You proved that Innovation and Integrity can coexist. Your governance maintained equilibrium across all pillars of power.",
      legacy: "A sustainable future where technology serves humanity without sacrificing core values."
    };
  }
  
  // ETHICAL GUARDIAN (High Ethics & Trust)
  if (e >= 70 && t >= 70 && i >= 40 && p >= 40) {
    return {
      title: "🛡️ Ethical Guardian",
      description: "A stable, technologically conservative world. You prioritized safety and trust over rapid innovation.",
      legacy: "Citizens sleep soundly, but global competitiveness may suffer in the long term."
    };
  }
  
  // VISIONARY INNOVATOR (High Innovation & Profit)
  if (i >= 75 && p >= 75 && e >= 40 && t >= 40) {
    return {
      title: "🚀 Visionary Innovator",
      description: "A hyper-advanced society where surveillance is an accepted trade-off for progress.",
      legacy: "Technological marvels abound, but at what cost to privacy and autonomy?"
    };
  }
  
  // DATA DEALER (High Profit, Low Ethics/Trust)
  if (p >= 70 && (e <= 35 || t <= 35)) {
    return {
      title: "💼 Data Dealer",
      description: "Wealth and power amassed at the expense of privacy and public faith.",
      legacy: "The Council became what it was meant to regulate: a profit-driven entity trading in human data."
    };
  }
  
  // ALGORITHM OVERLORD (Very High Innovation, Low Ethics/Trust)
  if (i >= 75 && (e <= 30 || t <= 30)) {
    return {
      title: "🤖 Algorithm Overlord",
      description: "A chilling technocracy where AI dictates life. The Council rules through technology alone.",
      legacy: "Innovation without ethics creates a dystopia where efficiency trumps humanity."
    };
  }
  
  // STALLED BUREAUCRAT (Default - Mediocre balance)
  return {
    title: "📋 Stalled Bureaucrat",
    description: "Indecision and compromise led to mediocrity. No clear vision emerged from your governance.",
    legacy: "The world muddles forward, neither thriving nor collapsing—simply existing."
  };
}
