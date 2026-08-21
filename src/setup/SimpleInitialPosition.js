import { PIECE_TYPES } from "../core/Piece.js";

export class SimpleInitialPosition {
  static apply(board) {
    board.clearPositions();
    const white = board.pieces.filter(p => p.color === "white");
    const black = board.pieces.filter(p => p.color === "black");

    const place = (piece, row, col) => {
      const sectionId = Math.floor(col / 4) + (row >= 4 ? 4 : 0);
      const cellIndex = (row % 4) * 4 + (col % 4);
      board.placePiece(piece, sectionId, cellIndex);
    };

    const order = [PIECE_TYPES.ROOK, PIECE_TYPES.KNIGHT, PIECE_TYPES.BISHOP, PIECE_TYPES.QUEEN, PIECE_TYPES.KING, PIECE_TYPES.BISHOP, PIECE_TYPES.KNIGHT, PIECE_TYPES.ROOK];

    const placeArmy = (army, majorRows, pawnRows) => {
      const pools = {};
      for (const type of Object.values(PIECE_TYPES)) pools[type] = army.filter(p => p.type === type);
      const used = Object.fromEntries(Object.values(PIECE_TYPES).map(t => [t, 0]));
      for (const row of majorRows) {
        for (let col = 0; col < 8; col++) {
          const type = order[col];
          place(pools[type][used[type]++], row, col);
        }
      }
      let pawnIndex = 0;
      for (const row of pawnRows) for (let col = 0; col < 8; col++) place(pools[PIECE_TYPES.PAWN][pawnIndex++], row, col);
    };

    placeArmy(black, [0, 1], [2, 3]);
    placeArmy(white, [7, 6], [5, 4]);
    return board;
  }
}
