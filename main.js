import "./ui/styles.css";
import { Game } from "./core/Game.js";
import { RuleEngine } from "./rules/RuleEngine.js";
import { MovementRules } from "./rules/chess/MovementRules.js";
import { AjetrezRules } from "./rules/ajetrez/AjetrezRules.js";
import { SimpleInitialPosition } from "./setup/SimpleInitialPosition.js";
import { GameController } from "./core/GameController.js";
import { BoardRenderer } from "./ui/BoardRenderer.js";
import { UIManager } from "./ui/UIManager.js";

const game = new Game();
const ruleEngine = new RuleEngine({
  movementRules: new MovementRules(),
  ajetrezRules: new AjetrezRules()
});

const controller = new GameController(game, ruleEngine);
SimpleInitialPosition.apply(game.board);

const renderer = new BoardRenderer(
  document.querySelector("#app"),
  game,
  controller
);

const ui = new UIManager(
  document.querySelector("#app"),
  game,
  controller,
  renderer
);

renderer.render();
ui.bind();

game.events.emit("GAME_READY", game);

console.log("Ajetrez V5 listo.", game);
