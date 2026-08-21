import { Section } from "./Section.js";
import { PieceFactory } from "./PieceFactory.js";
import { BoardQuery } from "./BoardQuery.js";

export class Board {
  constructor() {
    this.sections = [];
    this.pieces = [];
    this.createSections();
    this.createPieces();
    this.query = new BoardQuery(this);
  }

  createSections() {
    for (let i = 0; i < 8; i++) this.sections.push(new Section(i));
  }

  createPieces() {
    this.pieces = [
      ...PieceFactory.createArmy("white"),
      ...PieceFactory.createArmy("black")
    ];
  }

  getSection(id) {
    return this.sections.find(section => section.id === id) ?? null;
  }

  getPiece(id) {
    return this.pieces.find(piece => piece.id === id) ?? null;
  }

  clearPositions() {
    for (const section of this.sections) {
      section.cells.fill(null);
      section.pieces = [];
    }
    for (const piece of this.pieces) {
      piece.sectionId = null;
      piece.cellIndex = null;
      piece.captured = false;
      piece.hasMoved = false;
    }
  }

  placePiece(piece, sectionId, cellIndex) {
    const section = this.getSection(sectionId);
    if (!section) throw new Error(`Sección inexistente: ${sectionId}`);
    if (cellIndex < 0 || cellIndex > 15) throw new Error(`Casilla inválida: ${cellIndex}`);
    if (section.cells[cellIndex]) throw new Error(`Casilla ocupada: S${sectionId}:${cellIndex}`);

    if (piece.sectionId !== null) {
      const old = this.getSection(piece.sectionId);
      if (old) {
        old.cells[piece.cellIndex] = null;
        old.removePiece(piece);
      }
    }

    section.cells[cellIndex] = piece.id;
    section.addPiece(piece);
    piece.sectionId = sectionId;
    piece.cellIndex = cellIndex;
    piece.captured = false;
  }
}
