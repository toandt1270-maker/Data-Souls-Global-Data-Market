import { Card } from "../components/Card.js";
import { Button } from "../components/Button.js";
import { ProgressBar } from "../components/ProgressBar.js";
import { AuditorCommentary, updateCommentary, showLoadingState } from "../components/AuditorCommentary.js";
import { generateAuditorCommentary, isGeminiConfigured } from "../services/judge.js";
import { Modal } from "../components/Modal.js";
import { DecisionPreview } from "../components/DecisionPreview.js";
import { theme } from "../styles/theme.js";
import {
  pickScenario,
  rollStakeholder,
  applyDecision,
  maybeEvent,
  computeEnding,
  checkGameOver,
} from "../utils/logic.js";
import { 
  checkAchievements, 
  trackDecision, 
  trackStakeholder, 
  trackEvent, 
  trackScenario 
} from "../utils/achievements.js";

export const PlayView = {
  render(state, navigate) {
    const view = document.createElement("div");
    view.className = "view fade-in";

    console.log(`📍 PlayView render - Round: ${state.round}`);
    
    // Check for achievements at the start of each round (except first)
    if (state.round > 1) {
      console.log("🔍 Checking for achievements...");
      const newAchievements = checkAchievements(state);
      console.log(`✨ Found ${newAchievements.length} new achievements`);
      // Achievement popup will auto-show if any unlocked
    } else {
      console.log("⏭️ Skipping achievement check (Round 1)");
    }

    const scenario = pickScenario(state.round);
    state.currentScenario = scenario;
    
    // Track scenario for achievements
    trackScenario(state, scenario.id);

    // Round indicator - no max rounds, play until collapse
    const header = document.createElement("div");
    header.innerHTML = `
      <h2 class="glow-text">Round ${state.round}</h2>
      <p style="text-align: center; color: #94a3b8; font-size: 0.9rem; margin-top: 8px;">
        Survive as long as you can. One wrong move could collapse everything.
      </p>
    `;
    header.style.marginBottom = "24px";

    // Stats bars with theme integration
    const bars = document.createElement("div");
    bars.style.marginBottom = "24px";
    
    // Map stat names to their types for proper theming
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
      bars.appendChild(statBar);
    });

    const card = Card({
      title: scenario.title,
      description: scenario.desc,
      tags: scenario.tags,
    });

    // Add Auditor Commentary if available (show previous round's commentary)
    let auditorElement = null;
    if (state.lastCommentary && state.round > 1) {
      auditorElement = AuditorCommentary({
        commentary: state.lastCommentary,
        isLoading: false,
      });
    }

    const resultBox = document.createElement("div");
    resultBox.style.marginTop = "16px";

    const approve = Button({
      label: "✓ Approve",
      variant: "primary",
      onClick: () => showDecisionPreview("approve"),
    });
    const delay = Button({
      label: "⏸ Delay",
      variant: "secondary",
      onClick: () => showDecisionPreview("delay"),
    });
    const reject = Button({
      label: "✗ Reject",
      variant: "danger",
      onClick: () => showDecisionPreview("reject"),
    });

    const footer = document.createElement("footer");
    footer.style.display = "flex";
    footer.style.gap = "12px";
    footer.style.justifyContent = "center";
    footer.style.marginTop = "24px";
    footer.append(approve, delay, reject);

    // Assemble view
    view.append(header, bars);
    if (auditorElement) {
      view.appendChild(auditorElement);
    }
    view.append(card, footer, resultBox);

    // Guard flag to prevent multiple simultaneous decisions
    let isProcessingDecision = false;

    function showDecisionPreview(decision) {
      // Prevent multiple clicks during processing
      if (isProcessingDecision) {
        console.log("⚠️ Decision already in progress, ignoring click");
        return;
      }
      
      // Disable all buttons immediately when one is clicked
      approve.disabled = true;
      delay.disabled = true;
      reject.disabled = true;
      
      DecisionPreview({
        scenario: scenario,
        decisionKey: decision,
        onConfirm: () => handleDecision(decision),
        onCancel: () => {
          // Re-enable buttons if user cancels
          approve.disabled = false;
          delay.disabled = false;
          reject.disabled = false;
        }
      });
    }

    async function handleDecision(decision) {
      // Double-check guard (should already be set, but safety first)
      if (isProcessingDecision) {
        console.log("⚠️ Decision already in progress, aborting");
        return;
      }
      
      isProcessingDecision = true;
      console.log(`✅ Processing decision: ${decision}`);
      
      const stakeholder = rollStakeholder();
      
      // Track stakeholder for achievements
      if (stakeholder) {
        trackStakeholder(state, stakeholder.id);
      }
      
      // Track decision for achievements
      trackDecision(state, decision);
      
      applyDecision(state, decision, stakeholder);
      
      // Show stakeholder influence and reaction in ONE popup
      if (stakeholder) {
        const decisionData = scenario.decisions[decision];
        const concernStat = decisionData[stakeholder.concern] || 0;
        const isPositive = concernStat > 0;
        
        console.log("Showing stakeholder modal...");
        // Create and show stakeholder modal with close button
        await new Promise((resolve) => {
          Modal({
            title: stakeholder.name,
            content: `
              <p style="font-style: italic; color: #94a3b8; margin-bottom: 16px;">
                ${stakeholder.flavor}
              </p>
              <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 12px;">
                Their concern: <strong style="color: #f1f5f9;">${stakeholder.concern.toUpperCase()}</strong>
              </p>
              <div style="background: ${isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; 
                          border-left: 4px solid ${isPositive ? '#22c55e' : '#ef4444'}; 
                          padding: 12px; 
                          border-radius: 4px;">
                <strong style="color: ${isPositive ? '#22c55e' : '#ef4444'};">
                  ${isPositive ? 'Reaction:' : 'Reaction:'}
                </strong>
                <p style="margin-top: 8px; color: #f1f5f9;">
                  ${isPositive ? stakeholder.reaction_positive : stakeholder.reaction_negative}
                </p>
              </div>
            `,
            variant: isPositive ? "primary" : "danger",
            onClose: () => {
              console.log("Stakeholder modal closed");
              resolve();
            }
          });
        });
        console.log("Stakeholder modal promise resolved");
      }
      
      // Check for random events (increased trigger chance)
      const triggeredEvent = maybeEvent(state);
      if (triggeredEvent) {
        // Track event for achievements
        trackEvent(state, triggeredEvent.id);
        
        // Show event notification with close button
        await new Promise((resolve) => {
          Modal({
            title: triggeredEvent.title,
            content: triggeredEvent.description || "A significant event has occurred!",
            variant: triggeredEvent.category === "positive" ? "secondary" : "danger",
            onClose: resolve
          });
        });
      }
      
      // Check for game over conditions
      const gameOverCheck = checkGameOver(state);
      if (gameOverCheck.isGameOver) {
        state.gameOverReason = gameOverCheck;
        state.ending = {
          title: gameOverCheck.title,
          description: gameOverCheck.message,
          legacy: `Your governance lasted ${state.round} rounds before collapse.`
        };
        navigate("result", state);
        return;
      }

      // Generate AI commentary for next round (async, non-blocking)
      if (isGeminiConfigured()) {
        try {
          const commentary = await generateAuditorCommentary(
            state, 
            decision, 
            state.lastDecisionContext
          );
          state.lastCommentary = commentary;
        } catch (error) {
          console.log("Commentary generation skipped:", error.message);
          // Continue without commentary
        }
      }

      // No max rounds - play forever until collapse
      state.round++;
      navigate("play", state);
    }

    return view;
  },
};
