// src/utils/balance.js
import { clamp } from "./helpers.js";

export function applyBalanceAdjustments(state) {
  const { round, stats } = state;
  
  // Only activate balance after round 6 (give players time to establish strategy)
  if (round <= 6) {
    return state;
  }
  
  // PHASE 1: Gentler decay for high stats (prevents infinite growth)
  // Decay increases gradually: 0.08 (R7) → 0.14 (R8) → 0.20 (R9) → 0.26 (R10) → 0.32 (R11) → 0.38 (R12)
  const decayRate = 0.08 + (round - 6) * 0.02;
  
  for (const key of Object.keys(stats)) {
    if (stats[key] > 50) {
      stats[key] = clamp(stats[key] - decayRate, 0, 100);
    }
  }

  // PHASE 2: Specialist penalty (only for extreme specialists)
  // Only penalize if one stat is VERY high (>90) to prevent pure specialization exploit
  const maxKey = Object.entries(stats).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  if (stats[maxKey] > 90) {
    for (const key of Object.keys(stats)) {
      if (key !== maxKey) {
        stats[key] = clamp(stats[key] - 0.5, 0, 100); // Gentle penalty
      }
    }
  }

  // PHASE 3: Adaptive rebalancing (helps struggling metrics)
  // Gently nudges extreme outliers toward the mean
  // BUT: Don't rescue stats in critical danger zone (<= 15)
  const avg = Object.values(stats).reduce((a, b) => a + b, 0) / 4;
  for (const key of Object.keys(stats)) {
    if (stats[key] > avg + 25) {
      stats[key] = clamp(stats[key] - 0.5, 0, 100);
    }
    // Only help struggling stats if they're not in critical danger
    if (stats[key] < avg - 25 && stats[key] > 15) {
      stats[key] = clamp(stats[key] + 0.5, 0, 100);
    }
  }

  return state;
}
