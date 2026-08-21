export const GAME_STATUS = Object.freeze({
  READY: "ready",
  PLAYING: "playing",
  PAUSED: "paused",
  CHECK: "check",
  CHECKMATE: "checkmate",
  DRAW: "draw",
  FINISHED: "finished"
});

export class GameState {
  constructor() {
    this.status = GAME_STATUS.READY;
    this.turnNumber = 1;
    this.currentPlayer = "white";
  }
}
