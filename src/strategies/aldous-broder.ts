import Grid from '../model/grid';
import { arraySample } from '../util/index';

export default class AldousBroder {
  // Walks through each cell of the maze step by step
  static * step(grid:Grid) {
    let cell = grid.random_cell();
    let unvisited = grid.size - 1;

    while (unvisited > 0) {
      const neighbor = arraySample(Object.values(cell.neighbors));
      if (neighbor) {
        if (neighbor.links?.length === 0) {
          cell.link(neighbor);
          unvisited -= 1;
        }
        cell = neighbor;
        yield grid;
      }
    }
  }
  // executes all the steps at once
  static on(grid:Grid): Grid {
    const stepper = AldousBroder.step(grid);
    let i = 0;
    // eslint-disable-next-line
    for (let s of stepper) {
      i += 1;
    }
    console.log(`Aldous Broder in ${i}`);
    return grid;
  }
}
