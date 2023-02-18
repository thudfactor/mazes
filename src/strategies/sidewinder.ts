import Cell from '../model/cell';
import Grid from '../model/grid';
import { arraySample, randomFrom } from '../util/index';

export function* sidewinder(grid:Grid) {
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

