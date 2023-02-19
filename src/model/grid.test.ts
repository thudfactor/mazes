import Grid from "./grid";

describe("cell tests", () => {
  it("initializes a grid", () => {
    const g = new Grid(5, 10);
    expect(g.grid.length).toBe(5);
    expect(g.grid[0].length).toBe(10);
    expect(g.size).toBe(50);
  });

  it("returns a random cell", () => {
    const g = new Grid(5, 10);
    const r = g.random_cell();
    expect(r).toBeTruthy();
    expect(r.row < 5).toBe(true);
    expect(r.column < 10).toBe(true);
  });

  it("grabs rows sequentially", () => {
    const g = new Grid(5, 10);
    const r = g.eachRow();
    expect(r.next().value).toBe(g.grid[0]);
    expect(r.next().value).toBe(g.grid[1]);
  });

  it("grabs cells sequentially", () => {
    const g = new Grid(5, 10);
    const r = g.eachCell();
    expect(r.next().value).toBe(g.grid[0][0]);
    expect(r.next().value).toBe(g.grid[0][1]);
  });

  it("does a toString conversion", () => {
    const g = new Grid(2, 2);
    expect(g.toString().length).toBeGreaterThan(5);
  });
});
