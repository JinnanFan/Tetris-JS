import Tetromino from "./tetromino.js";
import Grid from "./grid.js";

export default class TetrisGame {
  CELL_SIZE = 2;
  ROWS = 20;
  COLS = 10;

  tetrominoe_I = [[1, 1, 1, 1]];

  tetrominoe_O = [
    [1, 1],
    [1, 1],
  ];

  tetrominoe_T = [
    [1, 1, 1],
    [0, 1, 0],
  ];

  tetrominoe_L = [
    [1, 0],
    [1, 0],
    [1, 1],
  ];

  tetrominoe_J = [
    [0, 1],
    [0, 1],
    [1, 1],
  ];

  tetrominoe_S = [
    [0, 1, 1],
    [1, 1, 0],
  ];

  tetrominoe_Z = [
    [1, 1, 0],
    [0, 1, 1],
  ];

  SHAPES = [
    this.tetrominoe_I,
    this.tetrominoe_O,
    this.tetrominoe_T,
    this.tetrominoe_L,
    this.tetrominoe_J,
    this.tetrominoe_S,
    this.tetrominoe_Z,
  ];

  COLORS = [
    "#00FFFF",
    "#FFFF00",
    "#FF00FF",
    "#FFBF00",
    "#0000FF",
    "#00FF00",
    "#FF0000",
  ];

  PIECE_FALLING_SPEED = 300;

  constructor(element) {
    this.gridEl = element;
    this.grid = [];
    this.freezeCells = [];
    this.currentPiece = null;
    // this.gameOver=false
  }

  setUpGame() {
    const gameBoard = new Grid(
      this.gridEl,
      this.ROWS,
      this.COLS,
      this.CELL_SIZE
    );
    this.grid = gameBoard.getGridArray();
  }
   gameInterval = setInterval(() => {
    if (this.gameOver()) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }else if (this.currentPiece === null) {
      this.newPiece();
    } else if (this.currentPiece.isFreeze) {
      this.pieceFreeze();
    } else {
      this.currentPiece.moveDown(this.freezeCells);
    }
    
  }, this.PIECE_FALLING_SPEED);
  startGame() {
    let gameInterval = setInterval(() => {
      if (this.gameOver()) {
        clearInterval(gameInterval);
        gameInterval = null;
      }else if (this.currentPiece === null) {
        this.newPiece();
      } else if (this.currentPiece.isFreeze) {
        this.pieceFreeze();
      } else {
        this.currentPiece.moveDown(this.freezeCells);
      }
      
    }, this.PIECE_FALLING_SPEED);
  }

  newPiece() {
    this.updateFreezePieces();

    const randomPiece = Math.floor(Math.random() * this.SHAPES.length);
    // const randomPiece = 1;
    const randomPositionX = Math.floor(
      Math.random() * (this.COLS - this.SHAPES[randomPiece][0].length + 1)
    );
    this.currentPiece = new Tetromino(
      this.grid,
      this.SHAPES[randomPiece],
      this.COLORS[randomPiece],
      [randomPositionX, 0]
    );
    console.log("current piece id", this.currentPiece.id);
    this.currentPiece.drawTetromino();
  }

  pieceFreeze() {
    this.currentPiece.tetrominoCells.forEach((cell) =>
      cell.classList.add("js-freeze")
    );
    this.currentPiece = null;
  }

  updateFreezePieces() {
    this.clearFullRows();
    const freezeNodelist = document.querySelectorAll(".js-freeze");

    this.freezeCells = Array.apply(null, freezeNodelist);
  }

  clearFullRows() {
    for (let i = 0; i < this.ROWS; i++) {
      const fullRow = this.grid[i].every((cell) => {
        return cell.classList.contains("js-freeze");
      });
      // console.log("fullRow", fullRow);
      if (fullRow) {
        let movingRows = i;

        while (movingRows > 0) {
          const row = this.grid[movingRows];
          const rowAbove = this.grid[movingRows - 1];
          this.copyRow(rowAbove, row);
          movingRows -= 1;
        }
        //reset the top row
        this.resetRow();
      }
    }
  }

  copyRow(fromRow, toRow) {
    for (let i = 0; i < toRow.length; i++) {
      toRow[i].classList = fromRow[i].classList;
      toRow[i].style.backgroundColor = fromRow[i].style.backgroundColor;
    }
  }

  // clear all the added classes and styles of the row
  resetRow(row = this.grid[0]) {
    row.forEach((cell) => {
      cell.classList.remove("js-freeze");
      cell.style.backgroundColor = "";
    });
  }

  // before draw any new pieces, check if this new piece will contain any freeze cells
  gameOver() {
    if (
      this.grid[0].some((cell) => {
        return cell.classList.contains("js-freeze");
      })
    ) {
      console.log("game over");
      return true;
      // displayGameOver()
    }
    console.log("game continue");

    return false;
  }

  // displayGameOver()


  userControl(e) {
    if (this.currentPiece) {
      if (e.key === "ArrowLeft") {
        this.currentPiece.moveRight(false, this.freezeCells);
      }
      if (e.key === "ArrowRight") {
        this.currentPiece.moveRight(true, this.freezeCells);
      }
      if (e.key === "ArrowDown") {
        this.currentPiece.moveDown(this.freezeCells);
      }
      if (e.key === "ArrowUp") {
        this.currentPiece.rotate(this.freezeCells);
      }
    }
  }
}
