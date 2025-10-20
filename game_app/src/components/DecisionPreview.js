import { theme } from "../styles/theme.js";
import { Button } from "./Button.js";

/**
 * Show a detailed preview of decision consequences before committing
 * Educational feature to help players understand impacts
 */
export function DecisionPreview({ scenario, decisionKey, onConfirm, onCancel }) {
  // Remove any existing decision preview modals to prevent overlap
  const existingPreviews = document.querySelectorAll('.modal');
  existingPreviews.forEach(modal => modal.remove());
  
  const decision = scenario.decisions[decisionKey];
  const consequence = decision.consequence || "Your choice will impact the balance of power.";
  
  const overlay = document.createElement("div");
  overlay.className = "modal";
  
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content fade-in";
  modalContent.style.maxWidth = "600px";
  modalContent.style.borderRadius = theme.ui.radius;
  modalContent.style.boxShadow = theme.ui.glow;
  
  // Decision title
  const title = document.createElement("h2");
  title.textContent = `${getDecisionIcon(decisionKey)} ${getDecisionLabel(decisionKey)}`;
  title.style.marginBottom = "16px";
  
  // Scenario context
  const context = document.createElement("p");
  context.textContent = `Scenario: ${scenario.title}`;
  context.style.color = theme.colors.textMuted;
  context.style.fontSize = "0.9rem";
  context.style.marginBottom = "24px";
  
  // Impact breakdown
  const impactSection = document.createElement("div");
  impactSection.style.background = "rgba(0, 0, 0, 0.3)";
  impactSection.style.padding = "16px";
  impactSection.style.borderRadius = "8px";
  impactSection.style.marginBottom = "16px";
  
  const impactTitle = document.createElement("h3");
  impactTitle.textContent = "📊 Statistical Impact";
  impactTitle.style.fontSize = "1rem";
  impactTitle.style.marginBottom = "12px";
  
  impactSection.appendChild(impactTitle);
  
  // Show each stat change
  const stats = ["innovation", "profit", "trust", "ethics"];
  stats.forEach(stat => {
    const value = decision[stat] || 0;
    if (value !== 0) {
      const statRow = document.createElement("div");
      statRow.style.display = "flex";
      statRow.style.justifyContent = "space-between";
      statRow.style.alignItems = "center";
      statRow.style.marginBottom = "8px";
      
      const statName = document.createElement("span");
      statName.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);
      statName.style.color = theme.colors[stat] || theme.colors.text;
      
      const statValue = document.createElement("span");
      statValue.textContent = value > 0 ? `+${value}` : value;
      statValue.style.fontWeight = "bold";
      statValue.style.fontSize = "1.1rem";
      
      // Color based on positive/negative
      if (value > 0) {
        statValue.style.color = "#4ade80"; // Green
      } else if (value < 0) {
        statValue.style.color = "#f87171"; // Red
      }
      
      // Warning for extreme values
      if (Math.abs(value) >= 7) {
        statValue.style.animation = "pulse 1s infinite";
        const warning = document.createElement("span");
        statValue.appendChild(warning);
      }
      
      statRow.appendChild(statName);
      statRow.appendChild(statValue);
      impactSection.appendChild(statRow);
    }
  });
  
  // Consequence description - MAKE IT PROMINENT!
  const consequenceBox = document.createElement("div");
  consequenceBox.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(234, 88, 12, 0.15))";
  consequenceBox.style.border = `2px solid ${theme.colors.primary}`;
  consequenceBox.style.padding = "20px";
  consequenceBox.style.borderRadius = "12px";
  consequenceBox.style.marginBottom = "24px";
  consequenceBox.style.boxShadow = "0 4px 16px rgba(139, 92, 246, 0.3)";
  
  const consequenceTitle = document.createElement("h3");
  consequenceTitle.textContent = "⚖️ Long-term Consequences";
  consequenceTitle.style.fontSize = "1.2rem";
  consequenceTitle.style.marginBottom = "12px";
  consequenceTitle.style.color = "#fbbf24";
  consequenceTitle.style.textShadow = "0 0 10px rgba(251, 191, 36, 0.5)";
  
  const consequenceText = document.createElement("p");
  consequenceText.textContent = consequence;
  consequenceText.style.lineHeight = "1.8";
  consequenceText.style.fontSize = "1.05rem";
  consequenceText.style.fontWeight = "500";
  consequenceText.style.color = "#f1f5f9";
  
  consequenceBox.appendChild(consequenceTitle);
  consequenceBox.appendChild(consequenceText);
  
  // Warning for extreme impact
  const totalImpact = Math.abs(decision.innovation || 0) + 
                      Math.abs(decision.profit || 0) + 
                      Math.abs(decision.trust || 0) + 
                      Math.abs(decision.ethics || 0);
  
  if (totalImpact >= 20) {
    const warningBox = document.createElement("div");
    warningBox.style.background = "rgba(239, 68, 68, 0.2)";
    warningBox.style.border = "2px solid #ef4444";
    warningBox.style.padding = "12px";
    warningBox.style.borderRadius = "8px";
    warningBox.style.marginBottom = "16px";
    warningBox.style.animation = "pulse 2s infinite";
    
    warningBox.innerHTML = `
      <strong style="color: #ef4444;">HIGH IMPACT DECISION</strong>
      <p style="margin-top: 8px; font-size: 0.9rem;">This choice will dramatically shift the balance of power. Consider carefully.</p>
    `;
    
    modalContent.appendChild(title);
    modalContent.appendChild(context);
    modalContent.appendChild(warningBox);
    modalContent.appendChild(impactSection);
    modalContent.appendChild(consequenceBox);
  } else {
    modalContent.appendChild(title);
    modalContent.appendChild(context);
    modalContent.appendChild(impactSection);
    modalContent.appendChild(consequenceBox);
  }
  
  // Buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "12px";
  buttonContainer.style.justifyContent = "center";
  
  const confirmBtn = Button({
    label: "Confirm Decision",
    variant: getButtonVariant(decisionKey),
    onClick: () => {
      overlay.remove();
      onConfirm();
    }
  });
  
  const cancelBtn = Button({
    label: "Reconsider",
    variant: "secondary",
    onClick: () => {
      overlay.remove();
      if (onCancel) onCancel();
    }
  });
  
  // Only show confirm button - no going back!
  buttonContainer.appendChild(confirmBtn);
  
  modalContent.appendChild(buttonContainer);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
  
  return overlay;
}

function getDecisionIcon(key) {
  const icons = {
    approve: "✓",
    delay: "⏸",
    reject: "✗"
  };
  return icons[key] || "•";
}

function getDecisionLabel(key) {
  const labels = {
    approve: "Approve",
    delay: "Delay for Review",
    reject: "Reject"
  };
  return labels[key] || key;
}

function getButtonVariant(key) {
  const variants = {
    approve: "primary",
    delay: "secondary",
    reject: "danger"
  };
  return variants[key] || "primary";
}
