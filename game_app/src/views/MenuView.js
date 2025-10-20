import { Button } from "../components/Button.js";
import { Modal } from "../components/Modal.js";
import { theme } from "../styles/theme.js";

export const MenuView = {
  render(state, navigate) {
    const view = document.createElement("div");
    view.className = "view fade-in";
    
    // Main title with gradient
    view.innerHTML = `
      <h1 style="font-size: 3rem; margin-bottom: 16px;">🧠 Data Souls</h1>
      <h3 style="color: ${theme.colors.textMuted}; margin-bottom: 32px;">Global Data class</h3>
      <p style="font-size: 1.125rem; max-width: 600px; margin: 0 auto 48px;">
        Balance <span class="text-innovation">Innovation</span>, 
        <span class="text-profit">Profit</span>, 
        <span class="text-trust">Trust</span>, and 
        <span class="text-ethics">Ethics</span> in the era of AI.
      </p>
    `;
    
    // Game info card
    const infoCard = document.createElement("div");
    infoCard.className = "card";
    infoCard.style.maxWidth = "500px";
    infoCard.style.margin = "0 auto 32px";
    infoCard.style.textAlign = "left";
    infoCard.innerHTML = `
      <h3 style="margin-bottom: 16px; text-align: center;">How to Play</h3>
      <ul style="list-style: none; padding: 0; color: ${theme.colors.textMuted};">
        <li style="margin-bottom: 12px;">📊 Manage four critical stats</li>
        <li style="margin-bottom: 12px;">🎯 Make decisions each round</li>
        <li style="margin-bottom: 12px;">⚖️ Balance competing interests</li>
        <li style="margin-bottom: 12px;">🏆 Reach the end with your values intact</li>
      </ul>
    `;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "16px";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "32px";
    buttonContainer.style.flexWrap = "wrap";
    
    // Define modal functions first
    const showAbout = () => {
      Modal({
        title: "📖 About Data Souls",
        content: `
          <div style="text-align: left; line-height: 1.8;">
            <p style="margin-bottom: 16px; color: #e2e8f0;">
              <strong>Data Souls: Global Data class</strong> is an interactive decision-making game where you lead the Global AI Ethics Council.
            </p>
            
            <h4 style="color: #a78bfa; margin: 20px 0 12px 0;">🎯 Your Mission</h4>
            <p style="color: #cbd5e1; margin-bottom: 16px;">
              Navigate complex ethical dilemmas in the age of AI. Every decision impacts four critical metrics:
            </p>
            <ul style="color: #94a3b8; margin-bottom: 16px; padding-left: 20px;">
              <li><span class="text-innovation">💡 Innovation</span> - Technological advancement</li>
              <li><span class="text-profit">💰 Profit</span> - Economic prosperity</li>
              <li><span class="text-trust">🤝 Trust</span> - Public confidence</li>
              <li><span class="text-ethics">⚖️ Ethics</span> - Moral integrity</li>
            </ul>
            
            <h4 style="color: #a78bfa; margin: 20px 0 12px 0;">⚡ Gameplay</h4>
            <p style="color: #cbd5e1; margin-bottom: 16px;">
              • Infinite survival mode - play until collapse<br>
              • 35 unique scenarios with real-world implications<br>
              • 20 stakeholders with different perspectives<br>
              • 48 random events based on your decisions<br>
              • 30 achievements to unlock<br>
              • Critical events trigger when stats drop below 15
            </p>
            
            <h4 style="color: #a78bfa; margin: 20px 0 12px 0;">🎓 Educational Value</h4>
            <p style="color: #cbd5e1;">
              Each scenario is designed to illustrate real debates in AI ethics, data privacy, and technology governance. There are no perfect solutions—only trade-offs.
            </p>
          </div>
        `,
        variant: "primary",
      });
    };
    
    const showCredits = () => {
      Modal({
        title: "👥 Credits",
        content: `
          <div style="text-align: left; line-height: 1.8;">
            <h4 style="color: #a78bfa; margin: 0 0 16px 0;">🎮 Game Design & Development</h4>
            <p style="color: #e2e8f0; margin-bottom: 24px;">
              <strong>Data Souls Team</strong><br>
              <span style="color: #94a3b8;">Game Design, Scenario Writing, Development</span>
            </p>
            
            <h4 style="color: #a78bfa; margin: 20px 0 16px 0;">🎨 Design & Technology</h4>
            <p style="color: #cbd5e1; margin-bottom: 24px;">
              • Vanilla JavaScript (ES6+)<br>
              • CSS3 with custom theme system<br>
              • Neon morality aesthetic design<br>
              • Modular component architecture
            </p>
            
            <h4 style="color: #a78bfa; margin: 20px 0 16px 0;">📚 Inspiration</h4>
            <p style="color: #cbd5e1; margin-bottom: 24px;">
              Inspired by decision-making games like <em>Reigns</em> and real-world debates in AI ethics, data governance, and technology policy.
            </p>
            
            <h4 style="color: #a78bfa; margin: 20px 0 16px 0;">🙏 Special Thanks</h4>
            <p style="color: #cbd5e1; margin-bottom: 16px;">
              To everyone working on ethical AI development and fighting for data privacy and digital rights worldwide.
            </p>
            
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 24px; text-align: center; font-style: italic;">
              "The future of AI depends on the decisions we make today."
            </p>
          </div>
        `,
        variant: "secondary",
      });
    };
    
    // Create buttons
    const play = Button({
      label: "🎮 Start Game",
      variant: "primary",
      onClick: () => navigate("play", state),
    });
    
    const about = Button({
      label: "📖 About",
      variant: "secondary",
      onClick: showAbout,
    });
    
    const credits = Button({
      label: "👥 Credits",
      variant: "secondary",
      onClick: showCredits,
    });
    
    buttonContainer.appendChild(play);
    buttonContainer.appendChild(about);
    buttonContainer.appendChild(credits);
    
    console.log("✅ MenuView: Created 3 buttons", { play, about, credits });
    console.log("📦 ButtonContainer children:", buttonContainer.children.length);
    
    view.appendChild(infoCard);
    view.appendChild(buttonContainer);
    
    return view;
  },
};
