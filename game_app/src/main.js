import { MenuView } from "./views/MenuView.js";
import { PlayView } from "./views/PlayView.js";
import { ResultView } from "./views/ResultView.js";
import { initGameState } from "./utils/logic.js";

const app = document.getElementById("app");
let state = initGameState();

function render(view) {
  app.innerHTML = "";
  app.appendChild(view.render(state, navigate));
}

function navigate(next, newState = state) {
  state = newState;
  if (next === "menu") render(MenuView);
  if (next === "play") render(PlayView);
  if (next === "result") render(ResultView);
}

render(MenuView);
