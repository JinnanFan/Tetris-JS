export default class Grid {
  constructor(element, rows, cols, cellSize) {
    this.gridEl = element;
    this.rows = rows;
    this.cols = cols;
    this.gridArray = [];
    this.gridEl.style.setProperty("--cell-size", `${cellSize}rem`);
    this.gridEl.style.setProperty("--grid-rows", this.rows);
    this.gridEl.style.setProperty("--grid-cols", this.cols);
  }

  getGridArray() {
    for (let i = 0; i < this.rows; i++) {
      // for each row in cells array, there are 10 elements.
      this.gridArray.push([]); 
      for (let j = 0; j < this.cols; j++) {
        const cellEl = document.createElement("div");
        cellEl.classList.add("cell");
        cellEl.id = i * this.cols + j;
        this.gridEl.appendChild(cellEl);
        this.gridArray[i].push(cellEl);
      }
    }
    return this.gridArray;
  }
}
