import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    selectRenderer,
    selectStrategy,
    selectSize,
} from './store/options-slice';
import styled from 'styled-components';
import Grid from './model/grid';
import { Settings } from './components/settings';
import { Navigator } from './components/navigator';

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

  fieldset {
    text-align: left;
  }
`

function generateMaze(builder: any, rows: number, columns: number): Grid {
  return builder(new Grid(rows,columns)).longestPath();
}

export function App() {
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
            maze={maze} 
            avatar={avatarPos} 
          /> 
        }
      </div>
      <div className="controls">
        <h1>Mazes</h1>
        <p><button onClick={() => rebuild()}>Generate Maze</button></p>
        <Settings />
        <Navigator navigate={navigateAvatar} />
      </div>
      <div className="meta">
        <p>Code adapted from <a href="http://www.mazesforprogrammers.com/">Mazes for Programmers</a> by Jamis Buck. <a href="https://github.com/thudfactor/mazes">Source code on GitHub</a>.</p>
      </div>
    </StyledLayout>
  );
}

