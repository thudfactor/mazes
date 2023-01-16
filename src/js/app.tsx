import Grid from './model/grid';
import BinaryTree from './model/binary-tree';
import { useState, useEffect, useRef } from 'react';
import { SVGRenderer } from './renderers/svg-renderer';
import Cell from './model/cell';
import styled from 'styled-components';

const StyledLayout = styled.div`
  position: absolute;
  inset: 1rem;
  background-color: white;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;

  .maze {
    padding: 1rem;
    grid-column: 1/3;
    grid-row: 1/3;
    text-align: center;
    background-color: #ccc;
    display: grid;
    place-content: center;

    svg {
      margin: auto;
      height: 80vmin;
      width: 80vmin;
    }
  }

  .controls {
    padding: 1rem;
    grid-column: 3/4;
    grid-row: 1/2;
    display: grid;
    place-content: center;
    text-align: center;
  }

  .meta {
    padding: 1rem;
    grid-column: 3/4;
    grid-row: 2/3;
    display: grid;
    place-content: center;
    text-align: center;
  }  
`

function generateMaze():Grid {
  return BinaryTree.on(new Grid(50,50));
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
    if (['w','ArrowUp'].includes(key)) {
      direction = ap.neighbors.north;
    } else if (['a','ArrowLeft'].includes(key)) {
      direction = ap.neighbors.west;
    }
    else if (['s','ArrowDown'].includes(key)) {
      direction = ap.neighbors.south;
    }
    else if (['d','ArrowRight'].includes(key)) {
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
    <StyledLayout>
      <div className="maze">
        { maze && <SVGRenderer maze={maze} avatar={avatarPos} /> }
      </div>
      <div className="controls">
        <h1>Mazes</h1>
        <p><button onClick={() => rebuild()}>Generate Maze</button></p>
        <p>Arrow keys or WASD to move</p>
      </div>
      <div className="meta">
        <p>This maze was generated using a binary tree algorithm. Code adapted from <a href="http://www.mazesforprogrammers.com/">Mazes for Programmers</a> by Jamis Buck. <a href="https://github.com/thudfactor/mazes">Source code on GitHub</a>.</p>
      </div>
    </StyledLayout>
  );
}

