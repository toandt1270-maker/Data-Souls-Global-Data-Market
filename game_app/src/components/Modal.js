import { theme } from "../styles/theme.js";
import { Button } from "./Button.js";

export function Modal({ title, content, onClose, variant = "primary" }) {
  // Remove any existing modals to prevent overlap
  const existingModals = document.querySelectorAll('.modal');
  existingModals.forEach(modal => modal.remove());
  
  const overlay = document.createElement("div");
  overlay.className = "modal";
  
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content fade-in";
  
  // Create title
  const titleEl = document.createElement("h2");
  titleEl.textContent = title;
  modalContent.appendChild(titleEl);
  
  // Create content (support both string and HTML)
  const contentEl = document.createElement("div");
  if (typeof content === 'string') {
    contentEl.innerHTML = content;
  } else {
    contentEl.appendChild(content);
  }
  modalContent.appendChild(contentEl);
  
  // Apply theme styling
  modalContent.style.borderRadius = theme.ui.radius;
  modalContent.style.boxShadow = theme.ui.glow;
  
  const btn = Button({
    label: "Close",
    variant: variant,
    onClick: () => {
      overlay.remove();
      if (onClose) onClose();
    }
  });
  
  modalContent.appendChild(btn);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
  
  return overlay;
}
