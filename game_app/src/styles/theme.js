// ===========================
// 🎨 DATA SOULS THEME: "Neon Morality"
// ===========================
// Concept: A balance between innovation and ethics,
// glowing between light (progress) and shadow (consequence).

export const theme = {
  // BASE COLORS
  colors: {
    background: "#0F111A",        // Deep dark space tone
    surface: "#1B1E2B",           // Soft card/panel base
    textPrimary: "#FFFFFF",       // Main readable text
    textMuted: "#AAB2C5",         // Secondary or hint text
    border: "rgba(255,255,255,0.08)",

    // ACCENTS (Neon Morality Palette)
    innovation: "#4DA6FF",        // Blue neon – creativity, logic
    profit: "#FFB84D",            // Amber gold – ambition, drive
    trust: "#66CC99",             // Emerald – empathy, reliability
    ethics: "#CC66FF",            // Violet – moral integrity

    // FEEDBACK COLORS
    positive: "#00E6A8",          // Ethical success
    risky: "#FFD966",             // Moral tension / uncertainty
    danger: "#FF4D4D",            // Data leak / crisis red
  },

  // TYPOGRAPHY
  font: {
    family: "'Inter', 'Segoe UI', sans-serif",
    size: {
      base: "16px",
      heading: "1.5rem",
      subheading: "1.125rem",
      small: "0.875rem",
    },
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: 1.6,
  },

  // UI ELEMENTS
  ui: {
    radius: "12px",
    shadow: "0 0 16px rgba(255, 255, 255, 0.1)",
    glow: "0 0 12px rgba(204, 102, 255, 0.4)", // violet glow default
    transition: "all 0.3s ease",
  },

  // GRADIENTS & EFFECTS
  gradient: {
    header: "linear-gradient(90deg, #4DA6FF 0%, #CC66FF 100%)",
    buttonPrimary: "linear-gradient(90deg, #4DA6FF 0%, #66CC99 100%)",
    crisis: "linear-gradient(120deg, #24111D 0%, #4B145C 100%)",
  },

  // STATE ANIMATION TONES
  glow: {
    normal: "0 0 8px rgba(255,255,255,0.1)",
    pulse: "0 0 16px rgba(102,204,153,0.5)",
    alert: "0 0 20px rgba(255,77,77,0.6)",
  },

  // FUNCTIONAL COLOR TOKENS (semantic)
  tokens: {
    statBar: {
      innovation: "#4DA6FF",
      profit: "#FFB84D",
      trust: "#66CC99",
      ethics: "#CC66FF",
    },
    button: {
      primary: "#4DA6FF",
      secondary: "#66CC99",
      danger: "#FF4D4D",
    },
    text: {
      onDark: "#FFFFFF",
      onLight: "#0F111A",
      muted: "#AAB2C5",
    },
  },
};
