export class Section {
  constructor(id) {
    this.id = id;
    this.cells = new Array(16).fill(null);
    this.pieces = [];
    this.offsetX = 0;
  }

  getOffset() {
    return this.offsetX;
  }

  setOffset(offsetX) {
    this.offsetX = offsetX;
  }

  addPiece(piece) {
    if (!this.pieces.includes(piece)) this.pieces.push(piece);
  }

  removePiece(piece) {
    this.pieces = this.pieces.filter(p => p.id !== piece.id);
  }
}
