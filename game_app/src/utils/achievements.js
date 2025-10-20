import { AchievementPopup } from "../components/AchievementPopup.js";

let achievements = [];
let unlockedAchievements = new Set();

// Load achievements data
async function loadAchievements() {
  try {
    const response = await fetch(new URL('../data/achievements.json', import.meta.url));
    achievements = await response.json();
    console.log(`Loaded ${achievements.length} achievements`);
  } catch (error) {
    console.error("Failed to load achievements:", error);
    achievements = [];
  }
}

// Initialize
loadAchievements();

/**
 * Check and unlock achievements based on game state
 */
export function checkAchievements(state) {
  console.log("🔍 Checking achievements... State:", state);
  console.log("📊 Total achievements loaded:", achievements.length);
  console.log("🔓 Already unlocked:", unlockedAchievements.size);
  
  const newAchievements = [];
  
  for (const achievement of achievements) {
    // Skip if already unlocked
    if (unlockedAchievements.has(achievement.id)) continue;
    
    // Check condition
    const conditionMet = checkCondition(achievement.condition, state);
    if (conditionMet) {
      console.log(`✅ Achievement condition met: ${achievement.id} - ${achievement.title}`);
      unlockAchievement(achievement);
      newAchievements.push(achievement);
    }
  }
  
  console.log(`🏆 New achievements unlocked: ${newAchievements.length}`);
  return newAchievements;
}

/**
 * Check if achievement condition is met
 */
function checkCondition(condition, state) {
  const { type } = condition;
  
  switch (type) {
    case 'rounds':
      return state.round >= condition.value;
    
    case 'stat':
      return state.stats[condition.stat] >= condition.value;
    
    case 'all_stats':
      return Object.values(state.stats).every(v => v >= condition.value);
    
    case 'balanced':
      // Check if all stats above threshold for duration
      if (!state.balancedStreak) state.balancedStreak = 0;
      const allAbove = Object.values(state.stats).every(v => v >= condition.threshold);
      if (allAbove) {
        state.balancedStreak++;
      } else {
        state.balancedStreak = 0;
      }
      return state.balancedStreak >= condition.duration;
    
    case 'near_death':
      return Object.values(state.stats).some(v => v < condition.threshold);
    
    case 'recovery':
      // Track lowest point and check if recovered
      if (!state.lowestStats) state.lowestStats = {};
      let recovered = false;
      for (const [stat, value] of Object.entries(state.stats)) {
        if (!state.lowestStats[stat]) state.lowestStats[stat] = value;
        if (value < state.lowestStats[stat]) {
          state.lowestStats[stat] = value;
        }
        if (state.lowestStats[stat] < condition.from && value > condition.to) {
          recovered = true;
        }
      }
      return recovered;
    
    case 'critical_events':
      if (!state.criticalEventCount) state.criticalEventCount = 0;
      return state.criticalEventCount >= condition.value;
    
    case 'decision_streak':
      if (!state.decisionStreak) state.decisionStreak = { type: null, count: 0 };
      return state.decisionStreak.type === condition.decision && 
             state.decisionStreak.count >= condition.count;
    
    case 'decision_count':
      if (!state.decisionCounts) state.decisionCounts = {};
      const count = state.decisionCounts[condition.decision] || 0;
      return count >= condition.count;
    
    case 'specialist':
      const targetStat = state.stats[condition.stat];
      const otherStats = Object.entries(state.stats)
        .filter(([k]) => k !== condition.stat)
        .map(([, v]) => v);
      return targetStat >= condition.high && otherStats.every(v => v < condition.low);
    
    case 'stakeholder_variety':
      if (!state.encounteredStakeholders) state.encounteredStakeholders = new Set();
      return state.encounteredStakeholders.size >= condition.count;
    
    case 'event_variety':
      if (!state.triggeredEvents) state.triggeredEvents = new Set();
      return state.triggeredEvents.size >= condition.count;
    
    case 'scenario_variety':
      if (!state.seenScenarios) state.seenScenarios = new Set();
      return state.seenScenarios.size >= condition.count;
    
    case 'narrow_range':
      if (!state.narrowRangeStreak) state.narrowRangeStreak = 0;
      const inRange = Object.values(state.stats).every(
        v => v >= condition.min && v <= condition.max
      );
      if (inRange) {
        state.narrowRangeStreak++;
      } else {
        state.narrowRangeStreak = 0;
      }
      return state.narrowRangeStreak >= condition.duration;
    
    case 'stat_swing':
      if (!state.lastStats) state.lastStats = { ...state.stats };
      const maxSwing = Math.max(
        ...Object.keys(state.stats).map(stat => 
          Math.abs(state.stats[stat] - state.lastStats[stat])
        )
      );
      state.lastStats = { ...state.stats };
      return maxSwing >= condition.value;
    
    case 'quick_collapse':
      return state.gameOverReason && state.round < condition.rounds;
    
    case 'meta':
      // Completionist - check if all others unlocked
      return unlockedAchievements.size >= achievements.length - 1;
    
    default:
      return false;
  }
}

/**
 * Unlock achievement and show popup
 */
function unlockAchievement(achievement) {
  unlockedAchievements.add(achievement.id);
  AchievementPopup({ achievement });
  
  // Save to localStorage
  saveUnlockedAchievements();
  
  console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
}

/**
 * Track decision for achievement purposes
 */
export function trackDecision(state, decision) {
  // Track decision counts
  if (!state.decisionCounts) state.decisionCounts = {};
  state.decisionCounts[decision] = (state.decisionCounts[decision] || 0) + 1;
  
  // Track decision streak
  if (!state.decisionStreak) {
    state.decisionStreak = { type: decision, count: 1 };
  } else if (state.decisionStreak.type === decision) {
    state.decisionStreak.count++;
  } else {
    state.decisionStreak = { type: decision, count: 1 };
  }
}

/**
 * Track stakeholder encounter
 */
export function trackStakeholder(state, stakeholderId) {
  if (!state.encounteredStakeholders) state.encounteredStakeholders = new Set();
  state.encounteredStakeholders.add(stakeholderId);
}

/**
 * Track event trigger
 */
export function trackEvent(state, eventId) {
  if (!state.triggeredEvents) state.triggeredEvents = new Set();
  state.triggeredEvents.add(eventId);
  
  // Track critical events
  if (eventId.startsWith('critical_')) {
    if (!state.criticalEventCount) state.criticalEventCount = 0;
    state.criticalEventCount++;
  }
}

/**
 * Track scenario
 */
export function trackScenario(state, scenarioId) {
  if (!state.seenScenarios) state.seenScenarios = new Set();
  state.seenScenarios.add(scenarioId);
}

/**
 * Get all unlocked achievements
 */
export function getUnlockedAchievements() {
  return Array.from(unlockedAchievements);
}

/**
 * Get achievement progress
 */
export function getAchievementProgress() {
  return {
    unlocked: unlockedAchievements.size,
    total: achievements.length,
    percentage: Math.round((unlockedAchievements.size / achievements.length) * 100)
  };
}

/**
 * Save unlocked achievements to localStorage
 */
function saveUnlockedAchievements() {
  try {
    localStorage.setItem('unlockedAchievements', JSON.stringify(Array.from(unlockedAchievements)));
  } catch (error) {
    console.error("Failed to save achievements:", error);
  }
}

/**
 * Load unlocked achievements from localStorage
 */
export function loadUnlockedAchievements() {
  try {
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) {
      unlockedAchievements = new Set(JSON.parse(saved));
      console.log(`📖 Loaded ${unlockedAchievements.size} unlocked achievements`);
    }
  } catch (error) {
    console.error("Failed to load achievements:", error);
  }
}

/**
 * Reset all achievements (for testing)
 */
export function resetAchievements() {
  unlockedAchievements.clear();
  localStorage.removeItem('unlockedAchievements');
  console.log("🔄 All achievements reset");
}

// Load saved achievements on init
loadUnlockedAchievements();
