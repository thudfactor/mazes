import Cell from '../model/cell';
import Grid from '../model/grid';
import { arraySample, randomFrom } from '../util/index';

export default class Sidewinder {
  static * step(grid:Grid) {
    const rowGenerator = grid.eachRow();
    for (let row of rowGenerator) {
      let run:Cell[] = [];
      for (let c of row) {
        run.push(c);
        const { eastBoundary, northBoundary } = grid.cellAtBoundaries(c);
        const shouldCloseOut = eastBoundary || 
                (!northBoundary && randomFrom(1) === 0);
        if (shouldCloseOut) {
          const member = arraySample(run);
          if (member.north) member.link(member.north);
          run = [];
        } else if (c.east) {
          c.link(c.east);
        }
        yield grid;
      }
    }
  }

  // executes all the steps at once
  static on(grid:Grid): Grid {
    const stepper = Sidewinder.step(grid);
    let i = 0;
    // eslint-disable-next-line
    for (let s of stepper) {
      i += 1;
    }
    console.log(`Sidewinder tree in ${i}`);
    return grid;
  }
}
