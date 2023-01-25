import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    toggleShowDistance, 
    toggleShowSolution,
    setSize,
    setRenderer,
    setStrategy,
    selectRenderer,
    selectStrategy,
    selectShowDistance,
    selectShowSolution,
    selectSize,
    Renderer,
    Strategy
} from './store/options-slice';
import styled from 'styled-components';
import Grid from './model/grid';
import BinaryTree from './strategies/binary-tree';
import Sidewinder from './strategies/sidewinder';
import { ASCIIRenderer } from './renderers/ascii-renderer';
import { SVGRenderer } from './renderers/svg-renderer';
import AldousBroder from './strategies/aldous-broder';

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

function generateMaze(builder: any, rows: number, columns: number): Grid {
  return builder(new Grid(rows,columns)).longestPath();
}

export function App() {
  const dispatch = useDispatch();
  const showSolution = useSelector(selectShowSolution);
  const showDistance = useSelector(selectShowDistance);
  const size = useSelector(selectSize);
  const builder = useSelector(selectStrategy);
  const RenderElement = useSelector(selectRenderer);

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
    const nextCell = ap.neighbors[direction];
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
        { maze && 
          <RenderElement
            showSolution={showSolution}
            showDistance={showDistance} 
            maze={maze} 
            avatar={avatarPos} 
          /> 
        }
      </div>
      <div className="controls">
        <h1>Mazes</h1>
        <p><button onClick={() => rebuild()}>Generate Maze</button></p>
        <p>Use WASD keys to move</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Renderer</legend>
            <label><input
              onChange={() => dispatch(setRenderer(Renderer.SVG))}
              checked={RenderElement === SVGRenderer}
              type="radio"
              name="renderer"
              value="svg" /> SVG</label><br/>
            <label><input 
              onChange={() => dispatch(setRenderer(Renderer.ASCII))}
              checked={RenderElement === ASCIIRenderer}
              type="radio"
              name="renderer"
              value="ascii" /> ASCII</label>
          </fieldset>
          <fieldset>
            <legend>Spoilers</legend>
            <label><input 
              onChange={() => dispatch(toggleShowSolution())}
              checked={showSolution}
              disabled={RenderElement === ASCIIRenderer}
              type="checkbox"
              name="show-solution"
              value="show-solution"
            /> Show Solution</label><br />
            <label><input 
              onChange={() => dispatch(toggleShowDistance())}
              checked={showDistance}
              type="checkbox"
              name="show-distance"
              value="show-distance"
            /> Show Distance</label>
          </fieldset>
          <fieldset>
            <legend>Build Strategy</legend>
            <p>Changing this will reset the maze.</p>
            <label><input
              onChange={() => dispatch(setStrategy(Strategy.AldousBroder))}
              checked={builder === AldousBroder.on}
              type="radio"
              name="builder"
              value="sidewinder" /> Aldous-Broder</label><br/>
            <label><input
              onChange={() => dispatch(setStrategy(Strategy.Sidewinder))}
              checked={builder === Sidewinder.on}
              type="radio"
              name="builder"
              value="sidewinder" /> Sidewinder</label><br/>
            <label><input 
              onChange={() => dispatch(setStrategy(Strategy.BinaryTree))}
              checked={builder === BinaryTree.on}
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
              onChange={(e) => dispatch(setSize(parseInt(e.target.value)))}
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

