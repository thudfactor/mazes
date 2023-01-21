import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Grid from './model/grid';
import BinaryTree from './strategies/binary-tree';
import Sidewinder from './strategies/sidewinder';
import { ASCIIRenderer } from './renderers/ascii-renderer';
import { SVGRenderer } from './renderers/svg-renderer';

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

  fieldset {
    text-align: left;
  }
`

function generateMaze(builder: string, rows: number, columns: number): Grid {
  let fn = BinaryTree.on;
  switch (builder) {
    case 'sidewinder':
      fn = Sidewinder.on;
      break;
  }
  return fn(new Grid(rows,columns));
}

export function App() {
  const [size, setSize] = useState(20);
  const [builder, setBuilder] = useState('sidewinder');
  const [renderer, setRenderer] = useState('svg');
  const [maze, setMaze] = useState(generateMaze(builder, size, size));
  const [avatarPos, _setAvatarPos] = useState(maze.start);
  
  // this nonsense is due to using state hooks in event handlers
  const avatarPosRef = useRef(avatarPos);
  const setAvatarPos = (data:any ) => {
    avatarPosRef.current = data;
    _setAvatarPos(data);
  }

  const navigateAvatar = useCallback((direction: string) => {
    const ap = avatarPosRef.current;
    const { neighbors } = ap;
    const nextCell = neighbors[direction];
    if (nextCell && ap.linked(nextCell)) {
      setAvatarPos(nextCell);
    }
  }, []);

  const rebuild = useCallback(() => {
    const newMaze = generateMaze(builder, size, size);
    setAvatarPos(newMaze.start);
    setMaze(newMaze);
  }, [builder, size]);

  useEffect(() => {

    function keyDown({ key }: { key: string; }) {
      if (!['w','a','s','d'].includes(key)) return;
      if (key === 'w') {
        navigateAvatar('north')
      } else if (key === 'a') {
        navigateAvatar('west')
      }
      else if (['s'].includes(key)) {
        navigateAvatar('south')
      }
      else if (['d'].includes(key)) {
        navigateAvatar('east')
      }
    }

    globalThis.addEventListener('keydown',keyDown);

    return (() => {
      globalThis.removeEventListener('keydown',keyDown);
    });
  }, [navigateAvatar]);

  useEffect(() => {
    rebuild();
  }, [size, builder, rebuild])

  return (
    <StyledLayout>
      <div className="maze">
        { renderer === 'svg' && maze && <SVGRenderer maze={maze} avatar={avatarPos} /> }
        { renderer === 'ascii' && <ASCIIRenderer maze={maze} avatar={avatarPos} /> }
      </div>
      <div className="controls">
        <h1>Mazes</h1>
        <p><button onClick={() => rebuild()}>Generate Maze</button></p>
        <p>Use WASD keys to move</p>
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
            <legend>Build Strategy</legend>
            <p>Changing this will reset the maze.</p>
            <label><input
              onChange={() => setBuilder("sidewinder")}
              checked={builder === 'sidewinder'}
              type="radio"
              name="builder"
              value="sidewinder" /> Sidewinder</label><br/>
            <label><input 
              onChange={() => setBuilder("binarytree")}
              checked={builder === 'binarytree'}
              type="radio"
              name="builder"
              value="binarytree" /> Binary Tree</label>
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
          <div className="navigation">
            <legend>Navigate</legend>
            <button onClick={() => navigateAvatar('north')}>↑</button><br />
            <button onClick={() => navigateAvatar('west')}>←</button> <button onClick={() => navigateAvatar('east')}>→</button><br />
            <button onClick={() => navigateAvatar('south')}>↓</button>
          </div>
        </form>
      </div>
      <div className="meta">
        <p>Code adapted from <a href="http://www.mazesforprogrammers.com/">Mazes for Programmers</a> by Jamis Buck. <a href="https://github.com/thudfactor/mazes">Source code on GitHub</a>.</p>
      </div>
    </StyledLayout>
  );
}
