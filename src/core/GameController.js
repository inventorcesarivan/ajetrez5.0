import { Move } from "./Move.js";

export class GameController {
  constructor(game, ruleEngine) {
    this.game = game;
    this.ruleEngine = ruleEngine;
  }

  move(pieceId, destination) {
    if (this.game.state.status !== "playing") {
      return { success: false, reason: "GAME_NOT_PLAYING" };
    }

    const piece = this.game.board.getPiece(pieceId);
    if (!piece) return { success: false, reason: "INVALID_PIECE" };

    if (piece.color !== this.game.state.currentPlayer) {
      return { success: false, reason: "NOT_YOUR_TURN" };
    }

    const validation = this.ruleEngine.validateMove(
      this.game,
      piece,
      destination
    );

    if (!validation.valid) {
      this.game.events.emit("MOVE_REJECTED", {
        piece,
        destination,
        reason: validation.reason
      });
      return { success: false, reason: validation.reason };
    }

    const from = {
      sectionId: piece.sectionId,
      cellIndex: piece.cellIndex
    };

    const targetPiece = this.game.board.query.getPieceAt(destination);

    if (targetPiece) {
      targetPiece.capture();
      const targetSection = this.game.board.getSection(targetPiece.sectionId);
      if (targetSection) {
        targetSection.cells[targetPiece.cellIndex] = null;
        targetSection.removePiece(targetPiece);
      }
      this.game.events.emit("PIECE_CAPTURED", {
        attacker: piece,
        captured: targetPiece
      });
    }

    this.game.board.placePiece(piece, destination.sectionId, destination.cellIndex);

    const move = new Move({
      pieceId: piece.id,
      from,
      to: destination,
      capturedPieceId: targetPiece?.id ?? null
    });

    this.game.history.push(move);

    this.game.events.emit("PIECE_MOVED", {
      move,
      piece,
      from,
      to: destination
    });

    this.game.switchTurn();

    return { success: true, move };
  }

  moveSection(sectionId, offsetX) {
    const section = this.game.board.getSection(sectionId);
    if (!section) return { success: false, reason: "INVALID_SECTION" };

    const result = this.ruleEngine.ajetrezRules.validateSectionOffset(
      this.game,
      section,
      offsetX
    );

    if (!result.valid) return result;

    section.setOffset(offsetX);

    this.game.events.emit("SECTION_MOVED", {
      sectionId,
      offsetX
    });

    return { success: true };
  }
}
