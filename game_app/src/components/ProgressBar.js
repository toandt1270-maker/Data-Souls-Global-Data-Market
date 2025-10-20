import { theme } from "../styles/theme.js";

export function ProgressBar({ label, value, color, statType }) {
  const wrapper = document.createElement("div");
  wrapper.className = "stat-container";
  
  // Determine extreme state
  const isExtremeLow = value <= 15;
  const isExtremeHigh = value >= 85;
  const isCritical = value <= 5;
  
  // Create label if provided
  if (label) {
    const labelDiv = document.createElement("div");
    labelDiv.className = "stat-label";
    
    // Add warning indicators for extreme values
    let statusIcon = "";
    if (isCritical) {
      statusIcon = '<span style="color: #ef4444; animation: pulse 1s infinite;">💀 CRITICAL</span>';
    } else if (isExtremeLow) {
      statusIcon = '<span style="color: #f59e0b; animation: pulse 2s infinite;">⚠️ LOW</span>';
    } else if (isExtremeHigh) {
      statusIcon = '<span style="color: #10b981; text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);">✨ DOMINANT</span>';
    }
    
    labelDiv.innerHTML = `
      <span class="name">${label} ${statusIcon}</span>
      <span class="value">${Math.round(value)}%</span>
    `;
    wrapper.appendChild(labelDiv);
  }
  
  // Create progress bar
  const container = document.createElement("div");
  container.className = statType ? "stat-bar" : "progress-bar";
  
  // Add visual effects for extreme values
  if (isCritical) {
    container.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 20px rgba(239, 68, 68, 0.3)";
    container.style.animation = "shake 0.5s infinite";
    container.style.border = "2px solid #ef4444";
  } else if (isExtremeLow) {
    container.style.boxShadow = "0 0 15px rgba(245, 158, 11, 0.5)";
    container.style.border = "1px solid #f59e0b";
  } else if (isExtremeHigh) {
    container.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 15px rgba(16, 185, 129, 0.2)";
    container.style.animation = "pulse 2s infinite";
  }
  
  const fill = document.createElement("div");
  fill.className = statType ? `stat-bar-fill ${statType}` : "progress-fill";
  
  // Use theme colors if statType is provided, otherwise use custom color
  if (statType && theme.tokens.statBar[statType]) {
    fill.style.backgroundColor = theme.tokens.statBar[statType];
    
    // Override color for extreme states
    if (isCritical) {
      fill.style.backgroundColor = "#ef4444";
      fill.style.backgroundImage = "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.3) 10px, rgba(0,0,0,.3) 20px)";
    } else if (isExtremeHigh) {
      fill.style.backgroundColor = theme.tokens.statBar[statType];
      fill.style.backgroundImage = "linear-gradient(90deg, " + theme.tokens.statBar[statType] + ", rgba(255,255,255,0.3))";
    }
  } else if (color) {
    fill.style.backgroundColor = color;
  }
  
  fill.style.width = `${Math.max(0, Math.min(100, value))}%`;
  fill.style.borderRadius = theme.ui.radius;
  
  // Add glow animation to fill for extreme highs
  if (isExtremeHigh) {
    fill.style.animation = "glow 1.5s ease-in-out infinite alternate";
  }
  
  container.appendChild(fill);
  wrapper.appendChild(container);
  
  return wrapper;
}
