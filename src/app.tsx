import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    selectRenderer,
    selectStrategy,
    selectSize,
} from './store/options-slice';
import Grid from './model/grid';
import { Settings } from './components/settings';
import { Navigator } from './components/navigator';
import { StyledControls, StyledLayout, StyledMaze } from './components/layout';
import { Meta } from './components/meta';

function generateMaze(builder: any, rows: number, columns: number): Grid {
  return builder(new Grid(rows,columns)).longestPath();
}

export function App() {
  const size = useSelector(selectSize);
  const builder = useSelector(selectStrategy);
  const RenderElement = useSelector(selectRenderer);

  const [maze, setMaze] = useState(() => generateMaze(builder, size, size));
  const [avatarPos, _setAvatarPos] = useState(() => maze.start);
  
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
    console.log('useEffect Running', size, builder, rebuild);
    rebuild();
  }, [size, builder, rebuild])

  return (
    <StyledLayout>
      <StyledMaze>
        { maze && 
          <RenderElement
            maze={maze} 
            avatar={avatarPos} 
          /> 
        }
      </StyledMaze>
      <StyledControls>
        <h1>Mazes</h1>
        <p><button onClick={() => rebuild()}>Generate Maze</button></p>
        <Settings />
        <Navigator navigate={navigateAvatar} />
      </StyledControls>
      <Meta />
    </StyledLayout>
  );
}

