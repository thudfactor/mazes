import Grid from './grid';
import BinaryTree from './binary-tree';

function generateMaze():string {
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

