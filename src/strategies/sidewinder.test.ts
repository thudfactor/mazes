import Grid from "../model/grid";
import Sidewinder from "./sidewinder";

describe('sidewinder', ()=> {
  it('makes a sidewinder maze', () => {
    const grid = new Grid(5,5);
    Sidewinder.on(grid);
    const eachCell = grid.eachCell();
    for (let cell of eachCell) {
      expect(cell?.linked.length).toBeGreaterThan(0);
      expect(cell?.linked.length).toBeLessThan(4);
    }
  });
});
