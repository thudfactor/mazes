import { arraySample } from './util.js';

export default class BinaryTree {
  static on(grid) {
    const cellGenerator = grid.eachCell();
    let c = cellGenerator.next().value;
    while (c) {
      const { north, east } = c.neighbors;
      if (north && east) {
        const neighbors = [north, east];
        const randomNeighbor = arraySample(neighbors);
        if (randomNeighbor) {
          c.link(randomNeighbor);
        }
      }
      if(!north && east) {
        c.link(east);
      }
      if(!east && north) {
        c.link(north);
      }
      c = cellGenerator.next().value;
    }
  }
}