import TetrisGame from "./tetrisGame.js";

const gridEl = document.querySelector(".grid");


let tetris = new TetrisGame(gridEl);
tetris.setUpGame();
// tetris.startGame();

document.addEventListener("keydown", (e) => {
  tetris.userControl(e);
});

