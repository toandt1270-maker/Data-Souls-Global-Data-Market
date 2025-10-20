import { theme } from "../styles/theme.js";

export function Card({ title, description, tags = [] }) {
  const el = document.createElement("div");
  el.className = "card fade-in";
  el.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    ${tags.length > 0 ? `<div class="tags">${tags.map(t => `<span>${t}</span>`).join("")}</div>` : ''}
  `;
  
  // Apply theme-based styling
  el.style.borderRadius = theme.ui.radius;
  el.style.transition = theme.ui.transition;
  
  return el;
}
