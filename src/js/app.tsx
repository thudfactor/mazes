import Grid from './model/grid';
import BinaryTree from './model/binary-tree';
import { useState, useEffect, useRef } from 'react';
import { SVGRenderer } from './renderers/svg-renderer';
import styled from 'styled-components';
import { ASCIIRenderer } from './renderers/ascii-renderer';

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
    overflow: auto;

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

  .navigation {
    button {
      display: inline-block;
      font-size: 2rem;
      margin: .5rem;
    }
  }
`

export function App() {
  const [size, setSize] = useState(20);
  const [maze, setMaze] = useState(generateMaze());
  const [avatarPos, _setAvatarPos] = useState(maze.start);
  const [renderer, setRenderer] = useState('svg');

  function generateMaze():Grid {
    return BinaryTree.on(new Grid(size,size));
  }
  
  // this nonsense is due to using state hooks in event handlers
  const avatarPosRef = useRef(avatarPos);
  const setAvatarPos = data => {
    avatarPosRef.current = data;
    _setAvatarPos(data);
  }

  function navigateAvatar(direction: string) {
    const ap = avatarPosRef.current;
    const { neighbors } = ap;
    const nextCell = neighbors[direction];
    if (nextCell && ap.linked(nextCell)) {
      setAvatarPos(nextCell);
    }
  }

  function keyDown({ key }: { key: string; }) {
    const ap = avatarPosRef.current;
    let direction = null;
    if (['w','ArrowUp'].includes(key)) {
      direction = 'north';
    } else if (['a','ArrowLeft'].includes(key)) {
      direction = 'west';
    }
    else if (['s','ArrowDown'].includes(key)) {
      direction = 'south';
    }
    else if (['d','ArrowRight'].includes(key)) {
      direction = 'east';
    }
    if (direction !== null) navigateAvatar(direction);
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

  useEffect(() => {
    rebuild();
  }, [size])

  return (
    <StyledLayout>
      <div className="maze">
        { renderer === 'svg' && maze && <SVGRenderer maze={maze} avatar={avatarPos} /> }
        { renderer === 'ascii' && <ASCIIRenderer maze={maze} avatar={avatarPos} /> }
      </div>
      <div className="controls">
        <h1>Mazes</h1>
        <p><button onClick={() => rebuild()}>Generate Maze</button></p>
        <p>Arrow keys or WASD to move</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Renderer</legend>
            <label><input
              onChange={() => setRenderer("svg")}
              checked={renderer === 'svg'}
              type="radio"
              name="renderer"
              value="svg" /> SVG</label><br/>
            <label><input 
              onChange={() => setRenderer("ascii")}
              checked={renderer === 'ascii'}
              type="radio"
              name="renderer"
              value="ascii" /> ASCII</label>
          </fieldset>
          <fieldset>
            <legend>Maze Attributes</legend>
            <p>Changing this will reset the maze.</p>
            <label><input 
              type="range" 
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              min={5} 
              max={50} 
              step={5} /> Size ({size})</label>
          </fieldset>
          <fieldset className="navigation">
            <legend>Navigate</legend>
            <button onClick={() => navigateAvatar('north')}>↑</button><br />
            <button onClick={() => navigateAvatar('west')}>←</button> <button onClick={() => navigateAvatar('east')}>→</button><br />
            <button onClick={() => navigateAvatar('south')}>↓</button>
          </fieldset>
        </form>
      </div>
      <div className="meta">
        <p>This maze was generated using a binary tree algorithm. Code adapted from <a href="http://www.mazesforprogrammers.com/">Mazes for Programmers</a> by Jamis Buck. <a href="https://github.com/thudfactor/mazes">Source code on GitHub</a>.</p>
      </div>
    </StyledLayout>
  );
}

