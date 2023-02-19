import Grid from "../model/grid";
import { arraySample } from "../util/index";

export function* binaryTree(grid: Grid) {
  const cellGenerator = grid.eachCell();
  for (let c of cellGenerator) {
    if (!c) continue;
    if (!c.north && c.east) {
      c.link(c.east);
    }
    if (!c.east && c.north) {
      c.link(c.north);
    }
    if (c.north && c.east) {
      const randomNeighbor = arraySample([c.north, c.east]);
      c.link(randomNeighbor);
    }
    yield grid;
  }
}
