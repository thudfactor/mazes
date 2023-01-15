import Grid from './model/grid';
import BinaryTree from './model/binary-tree';
import { useState } from 'react';
import { AsciiRenderer } from './renderers/ascii-renderer';

function generateMaze():Grid {
  return BinaryTree.on(new Grid(20,20));
}

export function App() {
  const [maze, setMaze] = useState(() => generateMaze());

  return (
    <div className="container">
      <h1>Mazes</h1>
      <p><button onClick={() => setMaze(generateMaze())}>Generate Maze</button></p>
      <AsciiRenderer maze={maze} />
      <p>This maze was generated using a binary tree algorithm. Code adapted from <a href="http://www.mazesforprogrammers.com/">Mazes for Programmers</a> by Jamis Buck. <a href="https://github.com/thudfactor/mazes">Source code on GitHub</a>.</p>
    </div>
  );
}

