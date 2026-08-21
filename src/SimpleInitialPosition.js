import { PIECE_TYPES } from "../core/Piece.js";

/*
 * Posición técnica provisional para probar el motor.
 *
 * IMPORTANTE:
 * La distribución oficial de Ajetrez todavía no está fijada.
 * Esta configuración evita llenar completamente el área central
 * y distribuye las 64 piezas entre las ocho secciones.
 *
 * Blancas: 4 secciones inferiores.
 * Negras: 4 secciones superiores.
 *
 * Esto nos permite probar movimientos y desplazamientos sin convertir
 * esta disposición en una regla definitiva del juego.
 */
export class SimpleInitialPosition {
  static apply(board) {
    board.clearPositions();

    const white = board.pieces.filter(p => p.color === "white");
    const black = board.pieces.filter(p => p.color === "black");

    const mainOrder = [
      PIECE_TYPES.ROOK,
      PIECE_TYPES.KNIGHT,
      PIECE_TYPES.BISHOP,
      PIECE_TYPES.QUEEN,
      PIECE_TYPES.KING,
      PIECE_TYPES.BISHOP,
      PIECE_TYPES.KNIGHT,
      PIECE_TYPES.ROOK
    ];

    const place = (piece, sectionId, localRow, localCol) => {
      const cellIndex = localRow * 4 + localCol;
      board.placePiece(piece, sectionId, cellIndex);
    };

    const distributeArmy = (army, sectionIds, reverse = false) => {
      const piecesByType = type => army.filter(p => p.type === type);
      const rooks = piecesByType(PIECE_TYPES.ROOK);
      const knights = piecesByType(PIECE_TYPES.KNIGHT);
      const bishops = piecesByType(PIECE_TYPES.BISHOP);
      const queens = piecesByType(PIECE_TYPES.QUEEN);
      const kings = piecesByType(PIECE_TYPES.KING);
      const pawns = piecesByType(PIECE_TYPES.PAWN);

      const major = [
        rooks[0], knights[0], bishops[0], queens[0],
        kings[0], bishops[1], knights[1], rooks[1]
      ];

      const major2 = [
        rooks[2], knights[2], bishops[2], queens[1],
        kings[1], bishops[3], knights[3], rooks[3]
      ];

      const rows = reverse ? [3, 2] : [0, 1];

      // Cada sección recibe una fila de 4 piezas.
      // 2 secciones × 8 piezas principales = 16 piezas.
      for (let s = 0; s < 2; s++) {
        const sectionId = sectionIds[s];
        const row = rows[s];
        const group = s === 0 ? major : major2;

        for (let col = 0; col < 4; col++) {
          place(group[col], sectionId, row, col);
        }
        for (let col = 0; col < 4; col++) {
          place(group[col + 4], sectionId, row, col);
        }
      }

      // 16 peones repartidos en las dos secciones restantes.
      const pawnSections = [sectionIds[2], sectionIds[3]];
      for (let i = 0; i < 16; i++) {
        const sectionId = pawnSections[Math.floor(i / 8)];
        const index = i % 8;
        const row = reverse ? (index < 4 ? 1 : 0) : (index < 4 ? 2 : 3);
        const col = index % 4;
        place(pawns[i], sectionId, row, col);
      }
    };

    // Negras ocupan las cuatro secciones superiores.
    // Blancas ocupan las cuatro inferiores.
    distributeArmy(black, [0, 1, 2, 3], false);
    distributeArmy(white, [4, 5, 6, 7], true);

    return board;
  }
}
