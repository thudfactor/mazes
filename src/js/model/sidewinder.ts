import Grid from './grid';
import { arraySample, randomFrom } from '../util/index';
import Cell from './cell';

export default class Sidewinder {
  static on(grid:Grid) {
    const rowGenerator = grid.eachRow();
    for (let row of rowGenerator) {
      let run = [];
      row.forEach((c:Cell) => {
        run.push(c);
        const { east, north } = c.neighbors;
        const atEastBoundary = !east;
        const atNorthBoundary = !north;
        const shouldCloseOut = atEastBoundary || 
                (!atNorthBoundary && randomFrom(1) === 0);
        if (shouldCloseOut) {
          const member = arraySample(run);
          if (member.neighbors.north) member.link(member.neighbors.north);
          run = [];
        } else {
          c.link(east);
        }
      });
    }
    return grid;
  }
}