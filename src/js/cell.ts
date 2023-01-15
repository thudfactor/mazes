type Neighbors = {
  north: Cell;
  east: Cell;
  south: Cell;
  west: Cell;
}

export default class Cell {
  row: number;
  column: number;
  links: Cell[];
  neighbors: Neighbors;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
    this.links = [];
    this.neighbors = {
      north: null,
      east: null,
      south: null,
      west: null
    }
  }

  link(cell: Cell, bidi = true) {
    this.links.push(cell);
    bidi && cell.link(this, false);
  }

  unlink(cell: Cell, bidi = true) {
    const newLinks = this.links.filter((current) => ((current.row !== cell.row) || (current.column !== cell.column)));
    this.links = newLinks;
    bidi && cell.unlink(this, false);
  }

  linked(cell: Cell) {
    const found = this.links.find((current) => {
      return ((current.row === cell.row) && (current.column === cell.column));
    });
    return (found instanceof Cell);
  }
}
