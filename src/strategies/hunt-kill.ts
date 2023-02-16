import Cell from '../model/cell';
import Grid from '../model/grid';
import { arraySample } from '../util/index';

export default class HuntKill {
  // Walks through each cell of the maze step by step
  static * step(grid:Grid) {
    let current: Cell | null = grid.random_cell();

    while (current) {
      const unvisitedNeighbors = Object.values(current.neighbors).filter(neighbor => {
        return neighbor?.links.length === 0;
      })

      if (unvisitedNeighbors.length > 0) {
        let chosen = arraySample(unvisitedNeighbors) as Cell;
        current.link(chosen);
        current = chosen;
      } else {
        current = null;

        const cellGenerator = grid.eachCell();

        for (let c of cellGenerator) {
          if (!c) continue;

          const visitedNeighbors = Object.values(c.neighbors).filter(neighbor => {
            return neighbor && neighbor?.links.length > 0;
          });

          if(c.links.length === 0 && visitedNeighbors.length > 0) {
            current = c;
            let chosen = arraySample(visitedNeighbors);
            current.link(chosen);
            break;
          }
        }
      }
      yield grid;
    }
  }
  // executes all the steps at once
  static on(grid:Grid): Grid {
    const stepper = HuntKill.step(grid);
    let i = 0;
    // eslint-disable-next-line
    for (let s of stepper) {
      i += 1;
    }
    console.log(`Hunt and Kill in ${i}`);
    return grid;
  }
}
