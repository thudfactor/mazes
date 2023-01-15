import Grid from './model/grid';
import BinaryTree from './model/binary-tree';
import { useState, useEffect, useRef } from 'react';
import { SVGRenderer } from './renderers/svg-renderer';
import Cell from './model/cell';

function generateMaze():Grid {
  return BinaryTree.on(new Grid(25,25));
}

export function App() {
  const [maze, setMaze] = useState(generateMaze());
  const [avatarPos, _setAvatarPos] = useState(maze.start);
  
  // this nonsense is due to using state hooks in event handlers
  const avatarPosRef = useRef(avatarPos);
  const setAvatarPos = data => {
    avatarPosRef.current = data;
    _setAvatarPos(data);
  }

  function navigateAvatar(direction: Cell) {
    const ap = avatarPosRef.current;
    if (ap.linked(direction)) {
      setAvatarPos(direction);
    }
  }

  function keyDown({ key }: { key: string; }) {
    const ap = avatarPosRef.current;
    let direction: Cell = null;
    if (['w','arrowUp'].includes(key)) {
      direction = ap.neighbors.north;
    } else if (['a','arrowLeft'].includes(key)) {
      direction = ap.neighbors.west;
    }
    else if (['s','arrowDown'].includes(key)) {
      direction = ap.neighbors.south;
    }
    else if (['d','arrowRight'].includes(key)) {
      direction = ap.neighbors.east;
    }
    if (direction && ap.linked(direction)) {
      navigateAvatar(direction);
    }
  }

  function rebuild() {
    const newMaze = generateMaze();
    setAvatarPos(newMaze.start);
    setMaze(newMaze);
  }

  useEffect(() => {
    globalThis.addEventListener('keydown',keyDown);

    return (() => {
      globalThis.removeEventListener('keydown',keyDown);
    });
  }, []);

  return (
    <div className="container" >
      <h1>Mazes</h1>
      <p><button onClick={() => rebuild()}>Generate Maze</button></p>
      <p>Arrow keys or WASD to move</p>
      { maze && <SVGRenderer maze={maze} avatar={avatarPos} /> }
      <p>This maze was generated using a binary tree algorithm. Code adapted from <a href="http://www.mazesforprogrammers.com/">Mazes for Programmers</a> by Jamis Buck. <a href="https://github.com/thudfactor/mazes">Source code on GitHub</a>.</p>
    </div>
  );
}

