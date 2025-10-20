// ===========================
// 🎨 THEME HELPER UTILITIES
// ===========================
// Helper functions for applying theme colors and styles

import { theme } from "../styles/theme.js";

/**
 * Get color by stat type
 * @param {string} statType - innovation, profit, trust, or ethics
 * @returns {string} Hex color code
 */
export function getStatColor(statType) {
  return theme.tokens.statBar[statType] || theme.colors.textMuted;
}

/**
 * Get appropriate text color class based on value
 * @param {number} value - Stat value (0-100)
 * @returns {string} CSS class name
 */
export function getValueColorClass(value) {
  if (value >= 70) return "text-positive";
  if (value >= 40) return "text-risky";
  return "text-danger";
}

/**
 * Apply glow effect based on stat type
 * @param {HTMLElement} element - DOM element
 * @param {string} statType - innovation, profit, trust, or ethics
 */
export function applyStatGlow(element, statType) {
  const color = getStatColor(statType);
  element.style.boxShadow = `0 0 12px ${color}`;
}

/**
 * Create a styled stat indicator
 * @param {string} label - Stat name
 * @param {number} value - Stat value
 * @param {string} statType - Stat type for coloring
 * @returns {HTMLElement}
 */
export function createStatBadge(label, value, statType) {
  const badge = document.createElement("span");
  badge.className = `stat-badge text-${statType}`;
  badge.textContent = `${label}: ${Math.round(value)}`;
  badge.style.display = "inline-block";
  badge.style.padding = "4px 12px";
  badge.style.borderRadius = theme.ui.radius;
  badge.style.backgroundColor = `${getStatColor(statType)}22`;
  badge.style.border = `1px solid ${getStatColor(statType)}`;
  badge.style.fontSize = theme.font.size.small;
  badge.style.fontWeight = theme.font.weight.medium;
  badge.style.margin = "4px";
  return badge;
}

/**
 * Apply theme transition to element
 * @param {HTMLElement} element
 */
export function applyThemeTransition(element) {
  element.style.transition = theme.ui.transition;
}

/**
 * Get feedback color based on decision outcome
 * @param {number} delta - Stat change amount
 * @returns {string} Color code
 */
export function getFeedbackColor(delta) {
  if (delta > 0) return theme.colors.positive;
  if (delta < 0) return theme.colors.danger;
  return theme.colors.risky;
}

/**
 * Create an animated notification element
 * @param {string} message
 * @param {string} type - 'positive', 'risky', or 'danger'
 * @returns {HTMLElement}
 */
export function createNotification(message, type = "risky") {
  const notification = document.createElement("div");
  notification.className = "notification fade-in";
  notification.textContent = message;
  notification.style.padding = "12px 24px";
  notification.style.borderRadius = theme.ui.radius;
  notification.style.marginTop = "16px";
  notification.style.fontWeight = theme.font.weight.medium;
  
  switch(type) {
    case "positive":
      notification.style.background = `${theme.colors.positive}22`;
      notification.style.border = `1px solid ${theme.colors.positive}`;
      notification.style.color = theme.colors.positive;
      break;
    case "danger":
      notification.style.background = `${theme.colors.danger}22`;
      notification.style.border = `1px solid ${theme.colors.danger}`;
      notification.style.color = theme.colors.danger;
      break;
    default:
      notification.style.background = `${theme.colors.risky}22`;
      notification.style.border = `1px solid ${theme.colors.risky}`;
      notification.style.color = theme.colors.risky;
  }
  
  return notification;
}

export default {
  getStatColor,
  getValueColorClass,
  applyStatGlow,
  createStatBadge,
  applyThemeTransition,
  getFeedbackColor,
  createNotification,
};
