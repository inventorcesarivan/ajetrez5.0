import { CoordinateSystem } from "../geometry/CoordinateSystem.js";

const SYMBOLS = {
  white: {
    king: "♔", queen: "♕", rook: "♖",
    bishop: "♗", knight: "♘", pawn: "♙"
  },
  black: {
    king: "♚", queen: "♛", rook: "♜",
    bishop: "♝", knight: "♞", pawn: "♟"
  }
};

export class BoardRenderer {
  constructor(root, game, controller) {
    this.root = root;
    this.game = game;
    this.controller = controller;
    this.selectedPiece = null;
    this.message = "Seleccioná una pieza blanca para comenzar.";
  }

  render() {
    this.root.innerHTML = `
      <main class="app-shell">
        <header class="topbar">
          <div>
            <div class="eyebrow">AJETREZ V5</div>
            <h1>Core Prototype 0.1</h1>
          </div>
          <div id="status" class="status"></div>
        </header>

        <section class="layout">
          <div class="board-wrap">
            <div id="board" class="board"></div>
            <div class="help">
              <strong>Prueba del motor:</strong>
              seleccioná una pieza y luego una casilla destino.
              La posición inicial y las reglas de desplazamiento de secciones son provisionales.
            </div>
          </div>

          <aside class="panel">
            <h2>Estado</h2>
            <div id="message" class="message"></div>
            <h3>Historial</h3>
            <div id="history" class="history"></div>
            <h3>Secciones</h3>
            <div id="sections" class="sections"></div>
            <button id="reset" class="button">Reiniciar partida</button>
          </aside>
        </section>
      </main>
    `;

    this.boardElement = this.root.querySelector("#board");
    this.statusElement = this.root.querySelector("#status");
    this.messageElement = this.root.querySelector("#message");
    this.historyElement = this.root.querySelector("#history");
    this.sectionsElement = this.root.querySelector("#sections");
    this.root.querySelector("#reset").addEventListener("click", () => location.reload());

    this.drawBoard();
    this.update();
  }

  drawBoard() {
    this.boardElement.innerHTML = "";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 16; col++) {
        const cell = document.createElement("button");
        cell.className = "cell";
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (col >= 4 && col <= 11) cell.classList.add("playable");
        if (col === 4 || col === 8 || col === 12) cell.classList.add("section-start");
        if ((row + col) % 2 === 0) cell.classList.add("light");

        const piece = this.game.board.query.getPieceAtGlobal({ row, column: col });
        if (piece) {
          cell.textContent = SYMBOLS[piece.color][piece.type];
          cell.classList.add(piece.color);
          cell.dataset.pieceId = piece.id;
        }

        cell.addEventListener("click", () => this.handleCell(row, col));
        this.boardElement.appendChild(cell);
      }
    }

    this.boardElement.style.gridTemplateColumns = "repeat(16, minmax(28px, 1fr))";
  }

  handleCell(row, col) {
    const piece = this.game.board.query.getPieceAtGlobal({ row, column: col });

    if (!this.selectedPiece) {
      if (!piece) {
        this.message = "Seleccioná una pieza.";
      } else if (piece.color !== this.game.state.currentPlayer) {
        this.message = "No es el turno de esa pieza.";
      } else {
        this.selectedPiece = piece;
        this.message = `Seleccionada: ${piece.color} ${piece.type}`;
      }
      this.update();
      this.drawBoard();
      return;
    }

    const sectionId = Math.floor(col / 4) + (row >= 4 ? 4 : 0);
    const cellIndex = (row % 4) * 4 + (col % 4);

    const result = this.controller.move(
      this.selectedPiece.id,
      { sectionId, cellIndex }
    );

    this.message = result.success
      ? "Movimiento realizado."
      : `Movimiento rechazado: ${result.reason}`;

    this.selectedPiece = null;
    this.drawBoard();
    this.update();
  }

  update() {
    const player = this.game.state.currentPlayer;
    this.statusElement.textContent =
      `Turno ${this.game.state.turnNumber} · ${player === "white" ? "Blancas" : "Negras"}`;

    this.messageElement.textContent = this.message;

    this.historyElement.innerHTML =
      this.game.history.length
        ? this.game.history.map((m, i) =>
            `<div>${i + 1}. ${m.pieceId} · S${m.from.sectionId}:${m.from.cellIndex} → S${m.to.sectionId}:${m.to.cellIndex}${m.capturedPieceId ? " ×" : ""}</div>`
          ).join("")
        : "<div class='muted'>Sin movimientos.</div>";

    this.sectionsElement.innerHTML = this.game.board.sections.map(section => `
      <div class="section-row">
        <span>S${section.id}</span>
        <span>offset ${section.offsetX}</span>
        <button data-section="${section.id}" data-offset="-4">−</button>
        <button data-section="${section.id}" data-offset="0">0</button>
        <button data-section="${section.id}" data-offset="4">+</button>
      </div>
    `).join("");

    this.sectionsElement.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const result = this.controller.moveSection(
          Number(btn.dataset.section),
          Number(btn.dataset.offset)
        );
        this.message = result.success
          ? `Sección S${btn.dataset.section} movida a offset ${btn.dataset.offset}.`
          : `Desplazamiento rechazado: ${result.reason}`;
        this.drawBoard();
        this.update();
      });
    });
  }
}
