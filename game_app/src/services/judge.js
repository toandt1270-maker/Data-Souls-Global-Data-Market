// ===========================
// 🤖 GEMINI AI SERVICE
// ===========================
// Service for integrating Google Gemini API for AI-driven commentary

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual API key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Generate AI commentary based on game state
 * @param {Object} state - Current game state
 * @param {string} lastDecision - Last decision made
 * @param {Object} decisionContext - Context about the last decision
 * @returns {Promise<string>} AI-generated commentary
 */
export async function generateAuditorCommentary(state, lastDecision = null, decisionContext = null) {
  const prompt = buildPrompt(state, lastDecision, decisionContext);
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const commentary = data.candidates[0]?.content?.parts[0]?.text || getDefaultCommentary(state);
    
    return commentary.trim();
  } catch (error) {
    console.error("Error generating AI commentary:", error);
    return getDefaultCommentary(state);
  }
}

/**
 * Build the prompt for Gemini based on game state
 */
function buildPrompt(state, lastDecision, decisionContext) {
  const { stats, round, maxRounds, decisionHistory = [] } = state;
  
  // Analyze stat balance
  const statAnalysis = analyzeStats(stats);
  const trend = analyzeDecisionTrend(decisionHistory);
  
  let prompt = `You are "The Auditor," an unseen AI overseer analyzing the Global Data Council's decisions in a data ethics simulation game.

CURRENT SITUATION (Round ${round}/${maxRounds}):
- Innovation: ${Math.round(stats.innovation)}% ${getStatEmoji(stats.innovation)}
- Profit: ${Math.round(stats.profit)}% ${getStatEmoji(stats.profit)}
- Trust: ${Math.round(stats.trust)}% ${getStatEmoji(stats.trust)}
- Ethics: ${Math.round(stats.ethics)}% ${getStatEmoji(stats.ethics)}

STAT ANALYSIS:
${statAnalysis}

DECISION PATTERN:
${trend}`;

  if (lastDecision && decisionContext) {
    prompt += `\n\nLAST DECISION: ${lastDecision} - "${decisionContext.title}"
Impact: ${JSON.stringify(decisionContext.impact)}`;
  }

  prompt += `\n\nProvide a brief (2-3 sentences), insightful commentary addressing the Council directly. Be thoughtful, philosophical, and sometimes provocative. Point out imbalances, praise wise choices, or warn about dangerous trends. Use metaphors related to data, technology, and society.

Commentary:`;

  return prompt;
}

/**
 * Analyze current stats to identify patterns
 */
function analyzeStats(stats) {
  const entries = Object.entries(stats);
  const avg = entries.reduce((sum, [_, v]) => sum + v, 0) / 4;
  
  const highest = entries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
  const lowest = entries.reduce((min, curr) => curr[1] < min[1] ? curr : min);
  
  const imbalance = highest[1] - lowest[1];
  
  let analysis = `Average balance: ${Math.round(avg)}%. `;
  
  if (imbalance > 40) {
    analysis += `SEVERE IMBALANCE: ${highest[0]} (${Math.round(highest[1])}%) dominates while ${lowest[0]} (${Math.round(lowest[1])}%) suffers.`;
  } else if (imbalance > 25) {
    analysis += `Notable imbalance: ${highest[0]} is prioritized over ${lowest[0]}.`;
  } else {
    analysis += `Relatively balanced governance.`;
  }
  
  // Check for critical thresholds
  const critical = entries.filter(([_, v]) => v < 20);
  if (critical.length > 0) {
    analysis += ` CRITICAL: ${critical.map(([k]) => k).join(", ")} in danger zone!`;
  }
  
  return analysis;
}

/**
 * Analyze decision history for patterns
 */
function analyzeDecisionTrend(history) {
  if (!history || history.length === 0) {
    return "No decision history yet.";
  }
  
  const recent = history.slice(-3);
  const approveCount = recent.filter(d => d === "approve").length;
  const rejectCount = recent.filter(d => d === "reject").length;
  const delayCount = recent.filter(d => d === "delay").length;
  
  if (approveCount >= 2) {
    return "Recent pattern: Aggressive approval. Taking risks.";
  } else if (rejectCount >= 2) {
    return "Recent pattern: Conservative rejection. Playing it safe.";
  } else if (delayCount >= 2) {
    return "Recent pattern: Indecisive delays. Avoiding hard choices.";
  } else {
    return "Recent pattern: Mixed decisions. Adaptive approach.";
  }
}

/**
 * Get emoji based on stat value
 */
function getStatEmoji(value) {
  if (value >= 70) return "✓";
  if (value >= 40) return "~";
  if (value >= 20) return "!";
  return "⚠";
}

/**
 * Get default commentary when API fails
 */
function getDefaultCommentary(state) {
  const { stats } = state;
  const templates = [
    `Council, your ${getHighestStat(stats)} is admirable, but remember: balance is the foundation of sustainable governance.`,
    `The data flows reveal your priorities. ${getLowestStat(stats)} demands your attention before it becomes a crisis.`,
    `Each decision ripples through the digital ecosystem. Your current trajectory suggests ${predictOutcome(stats)}.`,
    `I observe your choices, Council. The balance between progress and responsibility is delicate. Tread carefully.`,
    `Your ${getHighestStat(stats)} shines brightly, yet shadows grow where ${getLowestStat(stats)} falters. Balance, always balance.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function getHighestStat(stats) {
  return Object.entries(stats).reduce((max, curr) => curr[1] > max[1] ? curr : max)[0];
}

function getLowestStat(stats) {
  return Object.entries(stats).reduce((min, curr) => curr[1] < min[1] ? curr : min)[0];
}

function predictOutcome(stats) {
  const avg = Object.values(stats).reduce((a, b) => a + b, 0) / 4;
  if (avg >= 60) return "a prosperous but uncertain future";
  if (avg >= 40) return "a precarious equilibrium";
  return "systemic instability";
}

/**
 * Check if API key is configured
 */
export function isGeminiConfigured() {
  return GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY";
}

/**
 * Generate end-game analysis
 */
export async function generateFinalAnalysis(state) {
  const prompt = `You are "The Auditor," providing final analysis for the Global Data Council's complete session.

FINAL STATISTICS:
- Innovation: ${Math.round(state.stats.innovation)}%
- Profit: ${Math.round(state.stats.profit)}%
- Trust: ${Math.round(state.stats.trust)}%
- Ethics: ${Math.round(state.stats.ethics)}%

ENDING: ${state.ending}

Total Rounds: ${state.round}/${state.maxRounds}

Provide a thoughtful final assessment (3-4 sentences) that:
1. Reflects on their governance style
2. Acknowledges both successes and failures
3. Offers a philosophical insight about data governance
4. Leaves them with something to think about

Final Analysis:`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300,
        }
      })
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text?.trim() || getDefaultFinalAnalysis(state);
  } catch (error) {
    console.error("Error generating final analysis:", error);
    return getDefaultFinalAnalysis(state);
  }
}

function getDefaultFinalAnalysis(state) {
  return `Your journey through the Global Data class has concluded, Council. The path you chose—balancing ${getHighestStat(state.stats)} while managing ${getLowestStat(state.stats)}—tells a story of your values. In the age of AI, every decision carries weight beyond immediate consequences. Remember: data governance is not about perfection, but about mindful stewardship of humanity's digital future.`;
}

export default {
  generateAuditorCommentary,
  generateFinalAnalysis,
  isGeminiConfigured,
};
