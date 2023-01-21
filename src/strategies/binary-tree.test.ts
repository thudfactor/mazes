import Grid from "../model/grid";
import BinaryTree from "./binary-tree";

describe('binary tree', ()=> {
  it('makes a binary tree maze', () => {
    const grid = new Grid(5,5);
    BinaryTree.on(grid);
    const eachCell = grid.eachCell();
    for (let cell of eachCell) {
      expect(cell?.linked.length).toBeGreaterThan(0);
      expect(cell?.linked.length).toBeLessThan(4);
    }
  });
});
