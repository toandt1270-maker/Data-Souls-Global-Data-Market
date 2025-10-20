import { theme } from "../styles/theme.js";

/**
 * Display achievement unlock popup with animation
 */
export function AchievementPopup({ achievement }) {
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  
  // Rarity colors
  const rarityColors = {
    common: "#9ca3af",
    uncommon: "#22c55e",
    rare: "#3b82f6",
    epic: "#a855f7",
    legendary: "#f59e0b",
    mythic: "#ec4899"
  };
  
  const rarityColor = rarityColors[achievement.rarity] || rarityColors.common;
  
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
    border: 2px solid ${rarityColor};
    border-radius: 12px;
    padding: 20px;
    min-width: 320px;
    max-width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px ${rarityColor}40;
    z-index: 10000;
    animation: slideInRight 0.5s ease-out, pulse 2s ease-in-out;
    pointer-events: auto;
  `;
  
  // Header
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  `;
  
  const icon = document.createElement("div");
  icon.textContent = achievement.icon;
  icon.style.cssText = `
    font-size: 2.5rem;
    filter: drop-shadow(0 0 10px ${rarityColor});
  `;
  
  const headerText = document.createElement("div");
  headerText.style.flex = "1";
  
  const achievementLabel = document.createElement("div");
  achievementLabel.textContent = "🎉 ACHIEVEMENT UNLOCKED";
  achievementLabel.style.cssText = `
    font-size: 0.7rem;
    font-weight: bold;
    color: ${rarityColor};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  `;
  
  const title = document.createElement("div");
  title.textContent = achievement.title;
  title.style.cssText = `
    font-size: 1.2rem;
    font-weight: bold;
    color: ${theme.colors.text};
    text-shadow: 0 0 10px ${rarityColor}80;
  `;
  
  headerText.appendChild(achievementLabel);
  headerText.appendChild(title);
  header.appendChild(icon);
  header.appendChild(headerText);
  
  // Description
  const description = document.createElement("div");
  description.textContent = achievement.description;
  description.style.cssText = `
    font-size: 0.9rem;
    color: ${theme.colors.textMuted};
    line-height: 1.5;
    margin-bottom: 12px;
  `;
  
  // Rarity badge
  const rarityBadge = document.createElement("div");
  rarityBadge.textContent = achievement.rarity.toUpperCase();
  rarityBadge.style.cssText = `
    display: inline-block;
    padding: 4px 12px;
    background: ${rarityColor}20;
    border: 1px solid ${rarityColor};
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    color: ${rarityColor};
    text-transform: uppercase;
    letter-spacing: 1px;
  `;
  
  popup.appendChild(header);
  popup.appendChild(description);
  popup.appendChild(rarityBadge);
  
  document.body.appendChild(popup);
  
  // Play sound effect (if available)
  playAchievementSound(achievement.rarity);
  
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      popup.style.animation = 'slideOutRight 0.5s ease-in';
      setTimeout(() => {
        popup.remove();
      }, 500);
    }, 3000);  return popup;
}

/**
 * Play achievement sound based on rarity
 */
function playAchievementSound(rarity) {
  // Frequency based on rarity
  const frequencies = {
    common: 440,
    uncommon: 523,
    rare: 659,
    epic: 784,
    legendary: 880,
    mythic: 1047
  };
  
  const frequency = frequencies[rarity] || frequencies.common;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    // Silent fail if audio not available
    console.log("Audio not available for achievement sound");
  }
}

// Add CSS animations
if (!document.getElementById('achievement-animations')) {
  const style = document.createElement('style');
  style.id = 'achievement-animations';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(500px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(500px);
        opacity: 0;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
    }
  `;
  document.head.appendChild(style);
}
