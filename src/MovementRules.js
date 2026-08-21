import { PIECE_TYPES } from "../../core/Piece.js";
import { CoordinateSystem } from "../../geometry/CoordinateSystem.js";

export class MovementRules {
  validate(game, piece, destination) {
    if (piece.captured) return { valid: false, reason: "PIECE_CAPTURED" };
    if (!destination || destination.sectionId == null || destination.cellIndex == null) {
      return { valid: false, reason: "INVALID_DESTINATION" };
    }

    const target = game.board.query.getPieceAt(destination);
    if (target?.color === piece.color) {
      return { valid: false, reason: "OWN_PIECE" };
    }

    const fromSection = game.board.getSection(piece.sectionId);
    const toSection = game.board.getSection(destination.sectionId);
    if (!fromSection || !toSection) return { valid: false, reason: "INVALID_DESTINATION" };

    const from = CoordinateSystem.toGlobal(fromSection, piece.cellIndex);
    const to = CoordinateSystem.toGlobal(toSection, destination.cellIndex);

    switch (piece.type) {
      case PIECE_TYPES.ROOK:
        return this.sliding(game, from, to, true, false);
      case PIECE_TYPES.BISHOP:
        return this.sliding(game, from, to, false, true);
      case PIECE_TYPES.QUEEN:
        return this.sliding(game, from, to, true, true);
      case PIECE_TYPES.KNIGHT:
        return this.knight(from, to);
      case PIECE_TYPES.KING:
        return this.king(from, to);
      case PIECE_TYPES.PAWN:
        return this.pawn(game, piece, from, to, target);
      default:
        return { valid: false, reason: "UNKNOWN_PIECE" };
    }
  }

  sliding(game, from, to, orthogonal, diagonal) {
    const dr = Math.abs(to.row - from.row);
    const dc = Math.abs(to.column - from.column);

    const straight = dr === 0 || dc === 0;
    const diag = dr === dc && dr !== 0;

    if (!((orthogonal && straight) || (diagonal && diag))) {
      return { valid: false, reason: "INVALID_MOVEMENT" };
    }

    if (game.board.query.isPathBlockedGlobal(from, to)) {
      return { valid: false, reason: "PIECE_BLOCKED" };
    }

    return { valid: true, reason: null };
  }

  knight(from, to) {
    const dr = Math.abs(to.row - from.row);
    const dc = Math.abs(to.column - from.column);

    return (dr * dc === 2)
      ? { valid: true, reason: null }
      : { valid: false, reason: "INVALID_MOVEMENT" };
  }

  king(from, to) {
    const dr = Math.abs(to.row - from.row);
    const dc = Math.abs(to.column - from.column);

    return (dr <= 1 && dc <= 1 && (dr + dc > 0))
      ? { valid: true, reason: null }
      : { valid: false, reason: "INVALID_MOVEMENT" };
  }

  pawn(game, piece, from, to, target) {
    const direction = piece.color === "white" ? -1 : 1;
    const dr = to.row - from.row;
    const dc = to.column - from.column;

    if (!target && dc === 0 && dr === direction) {
      return { valid: true, reason: null };
    }

    if (target && Math.abs(dc) === 1 && dr === direction) {
      return { valid: true, reason: null };
    }

    if (!piece.hasMoved && !target && dc === 0 && dr === 2 * direction) {
      const middle = {
        row: from.row + direction,
        column: from.column
      };
      if (!game.board.query.getPieceAtGlobal(middle)) {
        return { valid: true, reason: null };
      }
    }

    return { valid: false, reason: "INVALID_MOVEMENT" };
  }
}
