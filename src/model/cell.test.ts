import Cell from "./cell";

describe("cell tests", () => {
  test("properly initializes a cell", () => {
    const cell = new Cell(0, 0);
    expect(cell.row).toBe(0);
    expect(cell.column).toBe(0);
    expect(cell.links.length).toBe(0);
    expect(cell.north).toBeNull();
    expect(cell.south).toBeNull();
    expect(cell.east).toBeNull();
    expect(cell.west).toBeNull();
  });

  test("can set neighbors", () => {
    const cell = new Cell(1, 1);
    const n = new Cell(1, 0);
    const s = new Cell(1, 2);
    const e = new Cell(2, 1);
    const w = new Cell(0, 1);
    cell.north = n;
    cell.south = s;
    cell.east = e;
    cell.west = w;
    expect(cell.north).toBe(n);
    expect(cell.south).toBe(s);
    expect(cell.east).toBe(e);
    expect(cell.west).toBe(w);
    expect(cell.neighbors.north).toBe(n);
    expect(cell.neighbors.south).toBe(s);
    expect(cell.neighbors.east).toBe(e);
    expect(cell.neighbors.west).toBe(w);
  });

  test("correctly matches two cells with the same coordinates", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 0);
    expect(cellA.equals(cellB)).toBe(true);
  });

  test("does not match cells with different coordinates", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    const cellC = new Cell(1, 0);
    const cellD = new Cell(1, 1);
    expect(cellA.equals(cellB)).toBe(false);
    expect(cellA.equals(cellC)).toBe(false);
    expect(cellA.equals(cellD)).toBe(false);
  });

  test("links two cells to each other", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    cellA.link(cellB);
    expect(cellA.linked(cellB)).toBe(true);
    expect(cellB.linked(cellA)).toBe(true);
  });

  test("makes a one-directional link", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    cellA.link(cellB, false);
    expect(cellA.linked(cellB)).toBe(true);
    expect(cellB.linked(cellA)).toBe(false);
  });

  test("unlinks two cells", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    cellA.link(cellB);
    expect(cellA.linked(cellB)).toBe(true);
    expect(cellB.linked(cellA)).toBe(true);
    cellA.unlink(cellB);
    expect(cellA.linked(cellB)).toBe(false);
    expect(cellB.linked(cellA)).toBe(false);
  });

  test("turns a bidirectional link into a one-way link", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    cellA.link(cellB);
    expect(cellA.linked(cellB)).toBe(true);
    expect(cellB.linked(cellA)).toBe(true);
    cellA.unlink(cellB, false);
    expect(cellA.linked(cellB)).toBe(false);
    expect(cellB.linked(cellA)).toBe(true);
  });

  test("cannot link the same cell over and over", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    cellA.link(cellB);
    cellA.link(cellB);
    cellA.link(cellB);
    cellA.link(cellB);
    cellA.link(cellB);
    expect(cellA.links.length).toBe(1);
    expect(cellB.links.length).toBe(1);
  });

  test("calculates distances", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    const cellC = new Cell(0, 2);
    const cellD = new Cell(1, 0);
    cellA.link(cellB);
    cellB.link(cellC);
    cellA.link(cellD);
    const d = cellA.distances();
    expect(d.at(cellA)).toBe(0);
    expect(d.at(cellB)).toBe(1);
    expect(d.at(cellC)).toBe(2);
    expect(d.at(cellD)).toBe(1);
  });

  test("caches distances", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    const cellC = new Cell(0, 2);
    const cellD = new Cell(1, 0);
    cellA.link(cellB);
    cellB.link(cellC);
    cellA.link(cellD);
    const d = cellA.distances();
    const e = cellA.distances();
    expect(d).toBe(e);
  });

  test("invalidates distance cache on request", () => {
    const cellA = new Cell(0, 0);
    const cellB = new Cell(0, 1);
    const cellC = new Cell(0, 2);
    const cellD = new Cell(1, 0);
    cellA.link(cellB);
    cellB.link(cellC);
    cellA.link(cellD);
    const d = cellA.distances();
    const e = cellA.distances(true);
    expect(d).not.toBe(e);
  });
});
