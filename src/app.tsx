import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { StyledControls, StyledLayout, StyledMaze } from "./components/layout";
import { Meta } from "./components/meta";
import { Navigator } from "./components/navigator";
import { Settings } from "./components/settings";
import WinState from "./hooray.gif";
import type Cell from "./model/cell";
import Grid from "./model/grid";
import { selectRenderer, selectSize, selectStrategy } from "./store/options-slice";
import { createMaze, MazeFunction } from "./strategies";

function generateMaze(builder: MazeFunction, rows: number, columns: number): Grid {
  return createMaze(new Grid(rows, columns), { strategy: builder }).longestPath();
}

export function App() {
  const size = useSelector(selectSize);
  const builder = useSelector(selectStrategy);
  const RenderElement = useSelector(selectRenderer);

  const [maze, setMaze] = useState(() => generateMaze(builder, size, size));
  const [avatarPos, _setAvatarPos] = useState(() => maze.start);

  // this nonsense is due to using state hooks in event handlers
  const avatarPosRef = useRef(avatarPos);
  const setAvatarPos = (data: Cell) => {
    avatarPosRef.current = data;
    _setAvatarPos(data);
  };

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

  const gameWon = maze.end.equals(avatarPos);

  useEffect(() => {
    function keyDown({ key }: { key: string }) {
      if (!["w", "a", "s", "d"].includes(key)) return;
      if (key === "w") {
        navigateAvatar("north");
      } else if (key === "a") {
        navigateAvatar("west");
      } else if (["s"].includes(key)) {
        navigateAvatar("south");
      } else if (["d"].includes(key)) {
        navigateAvatar("east");
      }
    }

    globalThis.addEventListener("keydown", keyDown);

    return () => {
      globalThis.removeEventListener("keydown", keyDown);
    };
  }, [navigateAvatar]);

  useEffect(() => {
    rebuild();
  }, [size, builder, rebuild]);

  return (
    <StyledLayout>
      <StyledMaze>{maze && <RenderElement maze={maze} avatar={avatarPos} />}</StyledMaze>
      <StyledControls>
        <h1>Mazes</h1>
        <p>
          <button onClick={() => rebuild()}>Generate Maze</button>
        </p>
        {gameWon && <img src={WinState} alt="You Win!" />}
        {!gameWon && <Settings />}
        <Navigator navigate={navigateAvatar} />
      </StyledControls>
      <Meta />
    </StyledLayout>
  );
}
