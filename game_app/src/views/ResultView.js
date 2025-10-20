import { Button } from "../components/Button.js";
import { ProgressBar } from "../components/ProgressBar.js";
import { AuditorCommentary, showLoadingState, updateCommentary } from "../components/AuditorCommentary.js";
import { generateFinalAnalysis, isGeminiConfigured } from "../services/judge.js";
import { theme } from "../styles/theme.js";

export const ResultView = {
  render(state, navigate) {
    const view = document.createElement("div");
    view.className = "view fade-in";
    
    // Header with gradient
    const header = document.createElement("h1");
    header.textContent = "🧠 Final Outcome";
    header.style.marginBottom = "24px";
    
    // Determine if game over or natural ending
    const isGameOver = state.gameOverReason && state.gameOverReason.isGameOver;
    const ending = state.ending;
    
    // Ending message with glow effect
    const endingBox = document.createElement("div");
    endingBox.className = "card";
    
    if (isGameOver) {
      endingBox.style.background = "linear-gradient(135deg, #1a0a0a 0%, #4B145C 100%)";
      endingBox.style.border = `2px solid ${theme.colors.danger}`;
      endingBox.classList.add("crisis-alert");
    } else {
      endingBox.style.background = theme.gradient.crisis;
      endingBox.style.border = `2px solid ${theme.colors.ethics}`;
    }
    
    endingBox.innerHTML = `
      <h2 class="glow-text">${typeof ending === 'string' ? ending : ending.title}</h2>
      <p style="margin-top: 16px; font-size: 1.1rem; line-height: 1.8;">
        ${typeof ending === 'string' ? 'Your decisions shaped the balance between Innovation, Profit, Trust, and Ethics.' : ending.description}
      </p>
      ${typeof ending === 'object' && ending.legacy ? `
        <p style="margin-top: 12px; color: ${theme.colors.textMuted}; font-style: italic;">
          <strong>Legacy:</strong> ${ending.legacy}
        </p>
      ` : ''}
      <div style="margin-top: 20px; padding: 12px; background: rgba(139, 92, 246, 0.1); border-radius: 8px; border-left: 4px solid ${theme.colors.primary};">
        <strong style="color: ${theme.colors.primary};">Rounds Survived: ${state.round}</strong>
        <p style="margin-top: 4px; font-size: 0.9rem; color: #94a3b8;">
          ${isGameOver ? 'Your governance collapsed under pressure.' : 'You maintained balance across all pillars.'}
        </p>
      </div>
    `;
    
    // Final stats display
    const statsContainer = document.createElement("div");
    statsContainer.style.marginTop = "32px";
    statsContainer.innerHTML = `<h3 style="margin-bottom: 16px;">Final Statistics</h3>`;
    
    const statsGrid = document.createElement("div");
    const statTypeMap = {
      innovation: "innovation",
      profit: "profit",
      trust: "trust",
      ethics: "ethics"
    };
    
    Object.entries(state.stats).forEach(([k, v]) => {
      const statBar = ProgressBar({
        label: k.charAt(0).toUpperCase() + k.slice(1),
        value: v,
        statType: statTypeMap[k.toLowerCase()],
      });
      statsGrid.appendChild(statBar);
    });
    
    statsContainer.appendChild(statsGrid);
    
    // AI Final Analysis
    const auditorElement = AuditorCommentary({
      commentary: "Analyzing your complete governance session...",
      isLoading: true,
    });
    
    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "16px";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "32px";
    
    const restart = Button({
      label: "🔄 Play Again",
      variant: "primary",
      onClick: () => {
        // Import and use initGameState directly
        import("../utils/logic.js").then(({ initGameState }) => {
          const freshState = initGameState();
          navigate("play", freshState);
        });
      },
    });
    
    buttonContainer.appendChild(restart);
    
    view.appendChild(header);
    view.appendChild(endingBox);
    view.appendChild(statsContainer);
    view.appendChild(auditorElement);
    view.appendChild(buttonContainer);
    
    // Generate final AI analysis asynchronously
    if (isGeminiConfigured()) {
      generateFinalAnalysis(state).then(analysis => {
        updateCommentary(auditorElement, analysis);
      }).catch(error => {
        console.error("Failed to generate final analysis:", error);
        updateCommentary(auditorElement, "Your journey has concluded. The balance you struck between innovation, profit, trust, and ethics will echo in the digital realm.");
      });
    } else {
      // Use default analysis if Gemini not configured
      updateCommentary(auditorElement, "Your governance session has concluded. Configure the Gemini API key to receive personalized AI analysis of your decisions.");
    }
    
    return view;
  },
};
