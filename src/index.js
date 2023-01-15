import Grid from './grid.js';
import BinaryTree from './binary-tree.js';

function generateMaze() {
  const maze = new Grid(20,20);
  BinaryTree.on(maze);
  return maze.toString();
}

const mazeOut = document.getElementById("mazeOut");
const button = document.getElementById("generate");

button.addEventListener('click', () => {
  mazeOut.innerHTML = generateMaze();
});

mazeOut.innerHTML = generateMaze();

