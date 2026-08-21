export const PIECE_TYPES = Object.freeze({
  KING: "king",
  QUEEN: "queen",
  ROOK: "rook",
  BISHOP: "bishop",
  KNIGHT: "knight",
  PAWN: "pawn"
});

export const COLORS = Object.freeze({
  WHITE: "white",
  BLACK: "black"
});

export class Piece {
  constructor({ id, type, color, sectionId = null, cellIndex = null }) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.sectionId = sectionId;
    this.cellIndex = cellIndex;
    this.hasMoved = false;
    this.captured = false;
  }

  moveTo(sectionId, cellIndex) {
    this.sectionId = sectionId;
    this.cellIndex = cellIndex;
    this.hasMoved = true;
  }

  capture() {
    this.captured = true;
  }
}
