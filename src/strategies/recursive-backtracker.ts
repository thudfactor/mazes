import Cell from "../model/cell";
import Grid from "../model/grid";
import { arraySample } from "../util/index";

/** River bias. Visits each cell exactly twice, but has higher memory needs than HK */
export function* recursiveBacktracker(grid: Grid) {
  const stack: Cell[] = [grid.start];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const unvisitedNeighbors = current.unvisitedNeighbors();
    console.log(unvisitedNeighbors);
    if (unvisitedNeighbors.length === 0) {
      stack.pop();
    } else {
      const newNeighbor = arraySample(unvisitedNeighbors);
      current.link(newNeighbor);
      stack.push(newNeighbor);
    }
    yield grid;
  }
}
