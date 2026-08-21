export const BOARD_CONFIG = Object.freeze({
  TOTAL_COLUMNS: 16,
  TOTAL_ROWS: 8,
  SECTION_COLUMNS: 4,
  SECTION_ROWS: 4,
  SECTION_COUNT: 8,
  PLAYABLE_COLUMNS: 8,
  PLAYABLE_ROWS: 8,
  PLAYABLE_START_COLUMN: 4,
  PLAYABLE_START_ROW: 0
});

export class CoordinateSystem {
  static cellToLocal(cellIndex) {
    return {
      row: Math.floor(cellIndex / 4),
      column: cellIndex % 4
    };
  }

  static localToCell(row, column) {
    return row * 4 + column;
  }

  static sectionOrigin(sectionId) {
    const isTop = sectionId < 4;
    const index = isTop ? sectionId : sectionId - 4;
    return {
      row: isTop ? 0 : 4,
      column: index * 4
    };
  }

  static toGlobal(section, cellIndex) {
    const local = this.cellToLocal(cellIndex);
    const origin = this.sectionOrigin(section.id);

    return {
      row: origin.row + local.row,
      column: origin.column + section.offsetX + local.column
    };
  }

  static isPlayable(position) {
    return (
      position.row >= 0 &&
      position.row < 8 &&
      position.column >= 4 &&
      position.column <= 11
    );
  }

  static areAdjacent(a, b) {
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.column - b.column);
    return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
  }
}
