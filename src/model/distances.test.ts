import Distances from "./distances";
import Cell from "./cell";

describe("Distances", () => {
  it("inits Distances correctly", () => {
    const cell = new Cell(0, 0);
    const distances = new Distances(cell);
    expect(distances.root).toBe(cell);
    expect(distances.cells().next().value).toBe(cell);
    expect(distances.at(cell)).toBe(0);
  });

  it("stores a new cell in the map with distance", () => {
    const cell = new Cell(0, 0);
    const nCell = new Cell(0, 1);
    const distances = new Distances(cell);
    distances.to(nCell, 1);
    expect(distances.at(nCell)).toBe(1);
  });
});
