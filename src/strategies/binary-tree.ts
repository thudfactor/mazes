import Grid from '../model/grid';
import { arraySample } from '../util/index';

export default class BinaryTree {
  static on(grid:Grid) {
    const cellGenerator = grid.eachCell();
    for (let c of cellGenerator) {
      if (!c) continue;
      const { north, east } = c.neighbors;
      if(!north && east) {
        c.link(east);
      }
      if(!east && north) {
        c.link(north);
      }
      if (north && east) {
        const randomNeighbor = arraySample([north, east]);
        if (randomNeighbor) {
          c.link(randomNeighbor);
        }
      }
    }
    return grid;
  }
}
