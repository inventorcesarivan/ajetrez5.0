export class Move {
  constructor({ pieceId, from, to, capturedPieceId = null, timestamp = Date.now() }) {
    this.pieceId = pieceId;
    this.from = from;
    this.to = to;
    this.capturedPieceId = capturedPieceId;
    this.timestamp = timestamp;
  }
}
