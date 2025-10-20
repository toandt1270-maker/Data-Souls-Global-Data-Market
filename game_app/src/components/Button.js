import { theme } from "../styles/theme.js";

export function Button({ label, variant = "primary", onClick }) {
  const btn = document.createElement("button");
  btn.className = `btn btn-${variant}`;
  btn.textContent = label;
  btn.onclick = onClick;
  
  // Apply theme-based styling
  btn.style.fontFamily = theme.font.family;
  btn.style.transition = theme.ui.transition;
  
  return btn;
}
