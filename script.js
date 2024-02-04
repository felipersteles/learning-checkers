// Elemento do tabuleiro
const boardElement = document.getElementById(`board`);

const generateButton = document.getElementById("generate");

const initialPieces = [
  { posY: 0, posX: 1, color: "black" },
  { posY: 0, posX: 3, color: "black" },
  { posY: 0, posX: 5, color: "black" },
  { posY: 0, posX: 7, color: "black" },
  { posY: 1, posX: 0, color: "black" },
  { posY: 1, posX: 2, color: "black" },
  { posY: 1, posX: 4, color: "black" },
  { posY: 1, posX: 6, color: "black" },
  { posY: 2, posX: 1, color: "black" },
  { posY: 2, posX: 3, color: "black" },
  { posY: 2, posX: 5, color: "black" },
  { posY: 2, posX: 7, color: "black" },
  { posY: 5, posX: 0, color: "white" },
  { posY: 5, posX: 2, color: "white" },
  { posY: 5, posX: 4, color: "white" },
  { posY: 5, posX: 6, color: "white" },
  { posY: 6, posX: 1, color: "white" },
  { posY: 6, posX: 3, color: "white" },
  { posY: 6, posX: 5, color: "white" },
  { posY: 6, posX: 7, color: "white" },
  { posY: 7, posX: 0, color: "white" },
  { posY: 7, posX: 2, color: "white" },
  { posY: 7, posX: 4, color: "white" },
  { posY: 7, posX: 6, color: "white" },
];

// ---------------------------------------------------------------------------------------------------------------------------------

class Position {
  x;
  y;

  constructor(x, y) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8) {
      // console.error("Invalid position");
      return null;
    }

    this.x = Number(x);
    this.y = Number(y);
  }

  nw() {
    return new Position(this.x - 1, this.y - 1);
  }

  ne() {
    return new Position(this.x + 1, this.y - 1);
  }

  sw() {
    return new Position(this.x - 1, this.y + 1);
  }

  se() {
    return new Position(this.x + 1, this.y + 1);
  }

  stringPos() {
    return `${String(x)},${String(y)}`;
  }
}

class Piece {
  position;
  element;

  constructor(piece) {
    this.create(piece);
  }

  create = (piece) => {
    this.element = document.createElement("div");
    this.element.setAttribute("id", "peca");

    this.element.classname = "";
    this.element.classList.add(piece.color); // adiciona a classe correspondente ao time

    this.position = new Position(piece.f, piece.posY);
  };
}

class Board {
  row;
  column;
  pieces;

  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.pieces = [];
  }

  generate() {
    boardElement.innerHTML = "";

    for (var l = 0; l < this.row; l++) {
      // criando o elemento linha
      var rowEl = document.createElement("tr");

      for (var c = 0; c < this.column; c++) {
        var pos = document.createElement("td");

        // colocando uma casa em casa
        // posição da linha
        pos.setAttribute("id", "casa");
        pos.setAttribute("pos", `${String(c)},${String(l)}`);
        rowEl.appendChild(pos);
      }

      boardElement.appendChild(rowEl);
    }
  }

  positionPieces = (pieces) => {
    pieces.forEach((p) => {
      const piece = new Piece(p);

      this.pieces.push(piece);

      const square = document.querySelector(`td[pos="${p.posX},${p.posY}"]`);

      square.appendChild(piece.element);
    });
  };
}

// I tried to use it on update function but the dom does not recognize
var possibleMoves;
var selectedPiece = null;
var whiteTurn;

class CheckersGame {
  board;

  constructor(board) {
    this.board = board;
  }

  start() {
    whiteTurn = true;
    setInterval(this.update, 1000 / 15);
  }

  update() {
    onclick = (e) => {
      const element = e.target;

      if (whiteTurn) {
        if (isWhite(element) && isPiece(element)) {
          clearPossibleMoves();

          selectedPiece = element;
          possibleMoves = verifyMovements(element, isWhite(element));
        }

        if (!isWhite(element) && isPiece(element)) {
          alert("White turn.");
        }
      } else {
        if (!isWhite(element) && isPiece(element)) {
          clearPossibleMoves();

          selectedPiece = element;
          possibleMoves = verifyMovements(element, isWhite(element));
        }

        if (isWhite(element) && isPiece(element)) {
          alert("Black turn.");
        }
      }

      if (selectedPiece && !isPiece(element)) {
        if (possibleMoves.includes(element))
          move(getPieceSquare(selectedPiece), element);
      }
    };
  }
}
var board;
var game;

generateButton.onclick = () => {
  board = new Board(8, 8);

  board.generate();
  board.positionPieces(initialPieces);

  game = new CheckersGame(board);
  game.start();
};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Funções auxiliares
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const isWhite = (element) => {
  return element.classList.value === "white";
};

const isPiece = (element) => {
  return element.id === "peca";
};

const emptySquare = (square) => {
  return square && square.firstChild === null;
};

const getPieceSquare = (piece) => {
  if (!piece) return;

  return piece.parentNode;
};

const getPosition = (square) => {
  const position = square.getAttribute("pos");
  const x = position.split(",")[0];
  const y = position.split(",")[1];

  return new Position(x, y);
};

const squareFromPosition = (pos) => {
  if (!pos) return null;

  return document.querySelector(`td[pos="${pos.x},${pos.y}"]`);
};

const move = (src, target) => {
  const piece = src.removeChild(selectedPiece);

  target.appendChild(piece);

  clearPossibleMoves();
  selectedPiece = null;

  whiteTurn = !whiteTurn;
};

const verifyMovements = (piece, isWhite) => {
  var possibleMoves = [];
  const pos = getPosition(piece.parentNode);

  const westSquare = squareFromPosition(isWhite ? pos.nw() : pos.sw());
  const eastSquare = squareFromPosition(isWhite ? pos.ne() : pos.se());

  // going to northeast position
  if (emptySquare(westSquare)) possibleMoves.push(westSquare);
  if (emptySquare(eastSquare)) possibleMoves.push(eastSquare);

  drawPossibleMoves(possibleMoves);
  return possibleMoves;
};

const drawPossibleMoves = (m) => {
  if (!m || m.length === 0) return;

  m.forEach((mov) => {
    draw(mov, "verde");
  });
};

const clearPossibleMoves = () => {
  if (!possibleMoves) return;

  if (possibleMoves.length > 0)
    possibleMoves.forEach((mov) => {
      clear(mov, "verde");
    });

  possibleMoves = null;
};

const draw = (casa, cor) => {
  if (casa) {
    casa.classList = "";
    casa.classList.add(cor);
  }
};

const clear = (casa, cor) => {
  if (casa) casa.classList.remove(cor);
};
