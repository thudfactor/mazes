import Cell from "../model/cell";
import Grid from "../model/grid";
import { arraySample } from "../util/index";

export function* huntKill(grid: Grid) {
  let current: Cell | null = grid.random_cell();

  while (current) {
    const unvisitedNeighbors = Object.values(current.neighbors).filter((neighbor) => {
      return neighbor?.links.length === 0;
    });

    if (unvisitedNeighbors.length > 0) {
      const chosen = arraySample(unvisitedNeighbors) as Cell;
      current.link(chosen);
      current = chosen;
    } else {
      current = null;

      const cellGenerator = grid.eachCell();

      for (const c of cellGenerator) {
        if (!c) continue;

        const visitedNeighbors = Object.values(c.neighbors).filter((neighbor) => {
          if (neighbor === null) return false;
          return neighbor && neighbor?.links.length > 0;
        });

        if (c.links.length === 0 && visitedNeighbors.length > 0) {
          current = c;
          const chosen = arraySample(visitedNeighbors);
          // We have filtered non-null values from the neighbors array above
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          current.link(chosen!);
          break;
        }
      }
    }
    yield grid;
  }
}
