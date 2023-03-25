import Grid from "../model/grid";
export { aldousBroder } from "./aldous-broder";
export { binaryTree } from "./binary-tree";
export { huntKill } from "./hunt-kill";
export { sidewinder } from "./sidewinder";
export { wilsons } from "./wilsons";
export { recursiveBacktracker } from "./recursive-backtracker";

export type MazeFunction = (grid: Grid) => Generator<Grid, void, unknown>;

interface MazeOptions {
  strategy: MazeFunction;
}

export function createMaze(grid: Grid, { strategy }: MazeOptions): Grid {
  const stepper = strategy(grid);
  let i = 0;
  // eslint-disable-next-line
  for (let s of stepper) {
    i += 1;
  }
  console.info(`${strategy.name} in ${i} steps`);
  return grid;
}
