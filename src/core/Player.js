export class Player {
  constructor(color) {
    this.color = color;
    this.pieces = [];
  }

  addPiece(piece) {
    if (!this.pieces.includes(piece)) this.pieces.push(piece);
  }

  getActivePieces() {
    return this.pieces.filter(piece => !piece.captured);
  }
}
