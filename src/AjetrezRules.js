import { CoordinateSystem } from "../../geometry/CoordinateSystem.js";

export class AjetrezRules {
  validateMove(game, piece, destination) {
    const targetSection = game.board.getSection(destination.sectionId);
    if (!targetSection) return { valid: false, reason: "INVALID_SECTION" };

    const fromSection = game.board.getSection(piece.sectionId);
    const from = CoordinateSystem.toGlobal(fromSection, piece.cellIndex);
    const to = CoordinateSystem.toGlobal(targetSection, destination.cellIndex);

    // Prototipo: el movimiento debe terminar dentro del tablero lógico.
    if (
      to.row < 0 || to.row >= 8 ||
      to.column < 0 || to.column >= 16
    ) {
      return { valid: false, reason: "OUT_OF_BOARD" };
    }

    // Regla provisional: una pieza no puede "saltar" de una sección
    // a otra durante el movimiento normal. El desplazamiento de secciones
    // será tratado como una operación independiente.
    if (piece.sectionId !== destination.sectionId) {
      return { valid: false, reason: "CROSS_SECTION_MOVE_PROVISIONAL" };
    }

    return { valid: true, reason: null };
  }

  validateSectionOffset(game, section, offsetX) {
    // Límites técnicos provisionales para probar la geometría.
    if (!Number.isInteger(offsetX)) {
      return { success: false, valid: false, reason: "OFFSET_MUST_BE_INTEGER" };
    }

    if (offsetX < -4 || offsetX > 4) {
      return { success: false, valid: false, reason: "OFFSET_OUT_OF_RANGE" };
    }

    return { success: true, valid: true };
  }
}
