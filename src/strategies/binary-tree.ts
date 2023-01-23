import Grid from '../model/grid';
import { arraySample } from '../util/index';

export default class BinaryTree {
  // Walks through each cell of the maze step by step
  static * step(grid:Grid) {
    const cellGenerator = grid.eachCell();
    for (let c of cellGenerator) {
      if (!c) continue;
      if(!c.north && c.east) {
        c.link(c.east);
      }
      if(!c.east && c.north) {
        c.link(c.north);
      }
      if (c.north && c.east) {
        const randomNeighbor = arraySample([c.north, c.east]);
        c.link(randomNeighbor);
      }
      yield grid;
    }
  }
  // executes all the steps at once
  static on(grid:Grid): Grid {
    const stepper = BinaryTree.step(grid);
    let i = 0;
    // eslint-disable-next-line
    for (let s of stepper) {
      i += 1;
    }
    console.log(`Binary tree in ${i}`);
    return grid;
  }
}
