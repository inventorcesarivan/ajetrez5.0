import { Piece, PIECE_TYPES } from "./Piece.js";

export class PieceFactory {
  static createArmy(color) {
    const pieces = [];
    const create = (type, amount, prefix) => {
      for (let i = 1; i <= amount; i++) {
        pieces.push(new Piece({
          id: `${color}-${prefix}-${i}`,
          type,
          color
        }));
      }
    };

    create(PIECE_TYPES.KING, 2, "king");
    create(PIECE_TYPES.QUEEN, 2, "queen");
    create(PIECE_TYPES.ROOK, 4, "rook");
    create(PIECE_TYPES.BISHOP, 4, "bishop");
    create(PIECE_TYPES.KNIGHT, 4, "knight");
    create(PIECE_TYPES.PAWN, 16, "pawn");

    return pieces;
  }
}
