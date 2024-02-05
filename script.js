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

const testUseCaseEatPiece = [
  { posY: 7, posX: 0, color: "white" },
  { posY: 6, posX: 1, color: "black" },
  { posY: 4, posX: 3, color: "black" },
  { posY: 2, posX: 1, color: "black" },
  { posY: 4, posX: 1, color: "black" },
  { posY: 2, posX: 5, color: "black" },
  { posY: 2, posX: 3, color: "black" },
  { posY: 4, posX: 5, color: "black" },
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

class Movement {
  square;
  eatPiece;

  constructor(square, eatPiece) {
    this.square = square;
    this.eatPiece = eatPiece;
  }
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
var possibleMoves = [];
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
          verifyMovements(element.parentNode, isWhite(element), possibleMoves);
          drawPossibleMoves();
        }

        if (!isWhite(element) && isPiece(element)) {
          alert("White turn.");
        }
      } else {
        if (!isWhite(element) && isPiece(element)) {
          clearPossibleMoves();

          selectedPiece = element;
          verifyMovements(element.parentNode, isWhite(element), possibleMoves);
          drawPossibleMoves();
        }

        if (isWhite(element) && isPiece(element)) {
          alert("Black turn.");
        }
      }

      if (selectedPiece && !isPiece(element)) {
        const moves = possibleMoves.map((move) => {
          return move.square;
        });

        console.log(moves);

        if (moves.includes(element)) {
          move(getPieceSquare(selectedPiece), element);
        }
      }
    };
  }
}
var board;
var game;

generateButton.onclick = () => {
  board = new Board(8, 8);

  board.generate();
  board.positionPieces(testUseCaseEatPiece);

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

const hasAEnemyPiece = (square, color) => {
  return (
    square && square.firstChild && square.firstChild.classList.value !== color
  );
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
  if (!position) return null;

  const x = position.split(",")[0];
  const y = position.split(",")[1];

  return new Position(x, y);
};

const getSquareFromPosition = (pos) => {
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

const verifyMovements = (
  pieceSquare,
  isWhite,
  possibleMoves,
  isLeft = null
) => {
  const pos = getPosition(pieceSquare);
  const color = isWhite ? "white" : "black";

  const west = isWhite ? pos.nw() : pos.sw();
  const east = isWhite ? pos.ne() : pos.se();

  const westSquare = getSquareFromPosition(west);
  const eastSquare = getSquareFromPosition(east);

  var aux = [];

  // simple move
  if (emptySquare(westSquare) && isLeft == null)
    possibleMoves.push(new Movement(westSquare, null));
  if (emptySquare(eastSquare) && isLeft == null)
    possibleMoves.push(new Movement(eastSquare, null));

  // eat piece
  if (hasAEnemyPiece(westSquare, color)) {
    const nextPos = isWhite
      ? getPosition(westSquare).nw()
      : getPosition(westSquare).sw();

    // enemy piece is disprotected
    const nextSquare = getSquareFromPosition(nextPos);
    if (emptySquare(nextSquare)) {
      // const eatingPieces = possibleMoves.map((move) => {
      //   return move.eatPiece;
      // });

      console.log("coming from", pieceSquare);
      console.log("eating", westSquare);
      console.log("going to", nextSquare);

      possibleMoves.push(new Movement(nextSquare, westSquare));
      verifyMovements(nextSquare, isWhite, possibleMoves, isLeft);
      if (!isLeft) {
        console.log("indo pra direita ou saindo");
        console.log("podar");
        const squares = possibleMoves.map((move) => {
          return move.square;
        });
        const eat = possibleMoves.map((move) => {
          return move.eatPiece;
        });
        aux.push({ squares, eat });
      }
      // if (!isEating) console.log("voltando");
    }
  }

  if (hasAEnemyPiece(eastSquare, color)) {
    const nextPos = isWhite
      ? getPosition(eastSquare).ne()
      : getPosition(eastSquare).se();

    const nextSquare = getSquareFromPosition(nextPos);
    if (emptySquare(nextSquare)) {
      console.log("coming from", pieceSquare);
      console.log("eating", eastSquare);
      console.log("going to", nextSquare);

      possibleMoves.push(new Movement(nextSquare, eastSquare));
      verifyMovements(nextSquare, isWhite, possibleMoves, !isLeft);
      if (isLeft) {
        console.log("indo pra esquerda ou saindo");
        console.log("podar");
        const squares = possibleMoves.map((move) => {
          return move.square;
        });
        const eat = possibleMoves.map((move) => {
          return move.eatPiece;
        });
        aux.push({ squares, eat });
      }
    }
  }

  console.log("Possible moves:", aux);
};

const drawPossibleMoves = () => {
  if (!possibleMoves || possibleMoves.length === 0) return;

  possibleMoves.forEach((mov) => {
    draw(mov.square, "verde");
  });
};

const clearPossibleMoves = () => {
  if (!possibleMoves) return;

  if (possibleMoves.length > 0)
    possibleMoves.forEach((mov) => {
      clear(mov.square, "verde");
    });

  possibleMoves = [];
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
