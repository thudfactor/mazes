import Cell from "./cell";

describe('cell tests', ()=> {
  test('properly initializes a cell', () => {
    const cell = new Cell(0,0);
    expect(cell.row).toBe(0);
    expect(cell.column).toBe(0);
  });
});