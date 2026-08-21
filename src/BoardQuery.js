import { CoordinateSystem } from "../geometry/CoordinateSystem.js";

export class BoardQuery {
  constructor(board) {
    this.board = board;
  }

  getPieceAt(position) {
    return this.board.pieces.find(piece =>
      !piece.captured &&
      piece.sectionId === position.sectionId &&
      piece.cellIndex === position.cellIndex
    ) ?? null;
  }

  getPieceAtGlobal(globalPosition) {
    return this.board.pieces.find(piece => {
      if (piece.captured || piece.sectionId == null) return false;
      const section = this.board.getSection(piece.sectionId);
      const p = CoordinateSystem.toGlobal(section, piece.cellIndex);
      return p.row === globalPosition.row && p.column === globalPosition.column;
    }) ?? null;
  }

  getPiecesByColor(color) {
    return this.board.pieces.filter(piece => piece.color === color && !piece.captured);
  }

  getActivePieces() {
    return this.board.pieces.filter(piece => !piece.captured && piece.sectionId !== null);
  }

  getPathGlobal(from, to) {
    const points = [];
    const dr = Math.sign(to.row - from.row);
    const dc = Math.sign(to.column - from.column);
    let row = from.row + dr;
    let column = from.column + dc;

    while (row !== to.row || column !== to.column) {
      points.push({ row, column });
      row += dr;
      column += dc;
    }
    return points;
  }

  isPathBlockedGlobal(from, to) {
    return this.getPathGlobal(from, to)
      .some(position => this.getPieceAtGlobal(position) !== null);
  }
}
