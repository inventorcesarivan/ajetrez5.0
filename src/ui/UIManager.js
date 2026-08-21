export class UIManager {
  constructor(root, game, controller, renderer) {
    this.root = root;
    this.game = game;
    this.controller = controller;
    this.renderer = renderer;
  }

  bind() {
    this.game.events.on("GAME_STARTED", () => {
      this.renderer.message = "Partida iniciada.";
      this.renderer.update();
    });

    this.game.events.on("TURN_CHANGED", player => {
      this.renderer.message =
        `Turno de ${player === "white" ? "blancas" : "negras"}.`;
      this.renderer.update();
    });

    this.game.events.on("MOVE_REJECTED", ({ reason }) => {
      console.debug("Movimiento rechazado:", reason);
    });

    this.game.events.on("PIECE_CAPTURED", ({ attacker, captured }) => {
      console.debug("Captura:", attacker.id, "x", captured.id);
    });

    this.game.events.on("SECTION_MOVED", data => {
      console.debug("Sección movida:", data);
    });

    this.game.start();
  }
}
