let id = 0;
export default class Tetromino {
  #y = 0;
  #x = 0;
  #rotations = [];

  constructor(array, shape, color = "#FFFFFF", position = [0, 0]) {
    id += 1;
    this.id = id;
    this.originalShape = shape;
    this.#rotations = this.#generateRotations(4);
    this.updateShape();
    this.color = color;
    [this.#x, this.#y] = position;
    this.grid = array;
    this.tetrominoCells = [];
    this.isFreeze = false;
  }

  updateCellsPosition() {
    this.tetrominoCells = [];

    for (let i = 0; i < this.shapeHeight; i++) {
      for (let j = 0; j < this.shapeWidth; j++) {
        if (this.shape[i][j]) {
          const cell = this.grid[this.#y + i][this.#x + j];
          this.tetrominoCells.push(cell);
        }
      }
    }
  }

  drawTetromino(color = this.color) {
    this.updateCellsPosition();
    this.#renderShape(color);
  }

  unDrawTetromino() {
    this.#renderShape("");
  }

  #renderShape(color) {
    this.tetrominoCells.forEach((cell) => {
      cell.style.backgroundColor = color;
    });
  }

  // collision with other freeze pieces (candidate array)
  #isCollision(candidate = null) {
    this.updateCellsPosition();
    let commonCell = false;
    if (candidate && candidate !== []) {
      //check if tetrominoCells and candidate comtain common elements
      commonCell = this.tetrominoCells.some((cell) => {
        return candidate.includes(cell);
      });
    }
    return commonCell;
  }

  // in the game board
  #inBound() {
    if (
      this.#x >= 0 &&
      this.#x + this.shapeWidth <= this.grid[0].length &&
      this.#y + this.shapeHeight <= this.grid.length
    ) {
      return true;
    }
    return false;
  }

  moveRight(right = true, candidate = null) {
    if (!this.isFreeze) {
      let rightStep = 1;
      if (!right) {
        rightStep = -1;
      }

      this.unDrawTetromino();

      this.#x = this.#x + rightStep;
      if (!this.#inBound()) {
        this.#x = this.#x - rightStep;
      } else if (this.#isCollision(candidate)) {
        this.#x = this.#x - rightStep;
      }
      this.drawTetromino();
    }
  }

  moveDown(candidate = null) {
    if (!this.isFreeze) {
      this.unDrawTetromino();
      this.#y += 1;
      if (!this.#inBound()) {
        this.#y -= 1;
        this.isFreeze = true;
      } else if (this.#isCollision(candidate)) {
        this.#y -= 1;
        this.isFreeze = true;
      }
      this.drawTetromino();
    }
  }

  rotate(candidate = null) {
    if (!this.isFreeze) {
      this.unDrawTetromino();
      this.nextShape();

      if (!this.#inBound()) {
        this.lastShape();
      } else if (this.#isCollision(candidate)) {
        this.lastShape();
      }
      this.drawTetromino();
    }
  }

  nextShape() {
    const tmp = this.#rotations.shift();
    this.#rotations.push(tmp);
    this.updateShape();
  }

  lastShape() {
    const tmp = this.#rotations.pop();
    this.#rotations.unshift(tmp);
    this.updateShape();
  }

  updateShape() {
    this.shape = this.#rotations[0];
    this.shapeWidth = this.shape[0].length;
    this.shapeHeight = this.shape.length;
  }

  // pre-store the rotated variation of this tetromino
  #generateRotations(maxVariation) {
    const rotations = [this.originalShape];
    let shape = rotations[0];

    for (let k = 1; k < maxVariation; k++) {
      let tempShape = [];
      let shapeWidth = shape[0].length;
      let shapeHeight = shape.length;
      for (let i = 0; i < shapeHeight; i++) {
        for (let j = 0; j < shapeWidth; j++) {
          //create an empty array if undefined
          tempShape[j] = tempShape[j] || [];
          tempShape[j][i] = shape[i][j];
        }
      }
      tempShape.forEach((row) => row.reverse());

      rotations.push(tempShape);
      // console.log("rotations", rotations)
      // console.log(rotations[0], tempShape)

      shape = tempShape;
    }
    return rotations;
  }
}
