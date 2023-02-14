import Cell from '../model/cell';
import Grid from '../model/grid';
import { arraySample } from '../util/index';

// Non-functioning, do not use
export default class Wilsons {
  // Walks through each cell of the maze step by step
  static * step(grid:Grid) {
    const unvisited: Cell[] = [];
    const gridGenerator = grid.eachCell();

    // Push all cells onto the unvisited queue
    for (let c of gridGenerator) {
      if (c) unvisited.push(c);
    }

    // Pick one at random, remove it from the unvisited array
    const first = arraySample(unvisited);
    const firstIndex = unvisited.indexOf(first);
    unvisited.splice(firstIndex, 1);

    let counter = 0
    while (unvisited.length > 0 && counter < 1800) {
      let cell = arraySample(unvisited);
      const path = [cell];

      while (unvisited.includes(cell)) {
        const nonNullNeighbors = Object.values(cell.neighbors).filter((v) => {
          return (v !== null);
        });
        cell = arraySample(nonNullNeighbors);
        const position = path.indexOf(cell);
        if (position >= 0) {
          path.splice(position + 1);
        } else {
          path.push(cell);
        }
      }

      for(let i = 0; i <= path.length - 2; i++) {
        path[i].link(path[i+1]);
        unvisited.splice(unvisited.indexOf(path[i]), 1);
      }
      console.log('unvisited length', unvisited.length);
      counter++;
      yield grid;
    }
    console.log('counter', counter);
  }

  // executes all the steps at once
  static on(grid:Grid): Grid {
    const stepper = Wilsons.step(grid);
    let i = 0;
    // eslint-disable-next-line
    for (let s of stepper) {
      i += 1;
    }
    console.log(`Wilsons in ${i}`);
    return grid;
  }
}
