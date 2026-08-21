import { Board } from "./Board.js";
import { GameState, GAME_STATUS } from "./GameState.js";
import { Player } from "./Player.js";
import { EventBus } from "../modules/EventBus.js";

export class Game {
  constructor() {
    this.board = new Board();
    this.players = {
      white: new Player("white"),
      black: new Player("black")
    };
    this.state = new GameState();
    this.events = new EventBus();
    this.history = [];

    for (const piece of this.board.pieces) {
      this.players[piece.color].addPiece(piece);
    }
  }

  start() {
    this.state.status = GAME_STATUS.PLAYING;
    this.events.emit("GAME_STARTED", this);
  }

  switchTurn() {
    this.state.currentPlayer =
      this.state.currentPlayer === "white" ? "black" : "white";
    this.state.turnNumber += 1;
    this.events.emit("TURN_CHANGED", this.state.currentPlayer);
  }
}
