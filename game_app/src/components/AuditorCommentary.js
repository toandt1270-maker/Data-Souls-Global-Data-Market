// ===========================
// 🤖 AUDITOR COMMENTARY COMPONENT
// ===========================
// Displays AI-generated commentary from "The Auditor"

import { theme } from "../styles/theme.js";

/**
 * Create an Auditor Commentary display
 * @param {string} commentary - The AI-generated commentary text
 * @param {boolean} isLoading - Whether commentary is being generated
 * @returns {HTMLElement}
 */
export function AuditorCommentary({ commentary, isLoading = false }) {
  const container = document.createElement("div");
  container.className = "auditor-commentary fade-in";
  
  // Styling
  container.style.background = `linear-gradient(135deg, ${theme.colors.surface} 0%, #1a1d2e 100%)`;
  container.style.border = `2px solid ${theme.colors.ethics}`;
  container.style.borderRadius = theme.ui.radius;
  container.style.padding = "20px";
  container.style.marginTop = "24px";
  container.style.marginBottom = "24px";
  container.style.position = "relative";
  container.style.overflow = "hidden";
  container.style.boxShadow = `0 0 20px ${theme.colors.ethics}40`;
  
  // Header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";
  header.style.marginBottom = "12px";
  header.style.borderBottom = `1px solid ${theme.colors.border}`;
  header.style.paddingBottom = "8px";
  
  const title = document.createElement("h4");
  title.innerHTML = `<span style="color: ${theme.colors.ethics}">🤖</span> The Auditor's Analysis`;
  title.style.margin = "0";
  title.style.fontSize = theme.font.size.subheading;
  title.style.fontWeight = theme.font.weight.bold;
  title.style.color = theme.colors.textPrimary;
  
  const badge = document.createElement("span");
  badge.textContent = "AI-Powered";
  badge.style.fontSize = theme.font.size.small;
  badge.style.color = theme.colors.ethics;
  badge.style.background = `${theme.colors.ethics}22`;
  badge.style.padding = "4px 8px";
  badge.style.borderRadius = "4px";
  badge.style.fontWeight = theme.font.weight.medium;
  
  header.appendChild(title);
  header.appendChild(badge);
  
  // Content
  const content = document.createElement("div");
  content.className = "commentary-content";
  content.style.fontSize = theme.font.size.base;
  content.style.lineHeight = "1.7";
  content.style.color = theme.colors.textMuted;
  content.style.fontStyle = "italic";
  content.style.position = "relative";
  content.style.paddingLeft = "16px";
  content.style.borderLeft = `3px solid ${theme.colors.ethics}`;
  
  if (isLoading) {
    content.innerHTML = `
      <div class="loading-animation">
        <span style="color: ${theme.colors.ethics}">●</span>
        <span style="color: ${theme.colors.ethics}; animation-delay: 0.2s">●</span>
        <span style="color: ${theme.colors.ethics}; animation-delay: 0.4s">●</span>
        <span style="margin-left: 8px; color: ${theme.colors.textMuted}">The Auditor is analyzing your decisions...</span>
      </div>
    `;
  } else {
    content.innerHTML = `"${commentary}"`;
  }
  
  // Decorative corner accent
  const accent = document.createElement("div");
  accent.style.position = "absolute";
  accent.style.top = "0";
  accent.style.right = "0";
  accent.style.width = "100px";
  accent.style.height = "100px";
  accent.style.background = `radial-gradient(circle at top right, ${theme.colors.ethics}20, transparent)`;
  accent.style.pointerEvents = "none";
  
  container.appendChild(accent);
  container.appendChild(header);
  container.appendChild(content);
  
  return container;
}

/**
 * Update existing commentary with new text
 * @param {HTMLElement} element - The commentary element
 * @param {string} newCommentary - New commentary text
 */
export function updateCommentary(element, newCommentary) {
  const content = element.querySelector(".commentary-content");
  if (content) {
    content.innerHTML = `"${newCommentary}"`;
    content.style.animation = "fadeIn 0.5s ease-out";
  }
}

/**
 * Show loading state
 * @param {HTMLElement} element - The commentary element
 */
export function showLoadingState(element) {
  const content = element.querySelector(".commentary-content");
  if (content) {
    content.innerHTML = `
      <div class="loading-animation">
        <span style="color: ${theme.colors.ethics}">●</span>
        <span style="color: ${theme.colors.ethics}; animation-delay: 0.2s">●</span>
        <span style="color: ${theme.colors.ethics}; animation-delay: 0.4s">●</span>
        <span style="margin-left: 8px; color: ${theme.colors.textMuted}">The Auditor is analyzing...</span>
      </div>
    `;
  }
}

/**
 * Create a compact commentary badge for in-game use
 * @param {string} shortText - Brief commentary
 * @returns {HTMLElement}
 */
export function AuditorBadge({ shortText }) {
  const badge = document.createElement("div");
  badge.className = "auditor-badge fade-in";
  badge.style.display = "inline-flex";
  badge.style.alignItems = "center";
  badge.style.gap = "8px";
  badge.style.background = `${theme.colors.ethics}15`;
  badge.style.border = `1px solid ${theme.colors.ethics}`;
  badge.style.borderRadius = "20px";
  badge.style.padding = "8px 16px";
  badge.style.fontSize = theme.font.size.small;
  badge.style.color = theme.colors.ethics;
  badge.style.fontWeight = theme.font.weight.medium;
  
  badge.innerHTML = `
    <span style="font-size: 1.2em">🤖</span>
    <span>${shortText}</span>
  `;
  
  return badge;
}

export default {
  AuditorCommentary,
  updateCommentary,
  showLoadingState,
  AuditorBadge,
};
