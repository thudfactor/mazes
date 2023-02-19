import Grid from "../model/grid";
import { arraySample } from "../util/index";

export function* aldousBroder(grid: Grid) {
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
