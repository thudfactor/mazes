export default class Cell {
  constructor(row, column) {
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

  link(cell, bidi = true) {
    this.links.push(cell);
    bidi && cell.link(this, false);
  }

  unlink(cell, bidi = true) {
    const newLinks = this.links.filter((current) => ((current.row !== cell.row) || (current.column !== cell.column)));
    this.links = newLinks;
    bidi && cell.unlink(this, false);
  }

  linked(cell) {
    const found = this.links.find((current) => {
      return ((current.row === cell.row) && (current.column === cell.column));
    });
    return (found instanceof Cell);
  }
}

