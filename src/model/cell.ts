import Distances from "./distances";

type Neighbors = {
  [key: string]: Cell | null;
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

  // Checks for equality with a cell by comparing the cells address
  equals(cell: Cell):boolean {
    return this.row === cell.row && this.column === cell.column;
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

  distances() {
    const distances = new Distances(this);
    let frontier = [this as Cell];

    while (frontier.length !== 0) {
      const new_frontier:Cell[] = [];
      frontier.forEach((cell) => {
        const currentDistance = distances.at(cell);
        if (currentDistance !== 0 && !currentDistance) {
          console.error('no distance stored for ', cell);
          return;
        }
        cell.links.forEach((linked) => {
          if (distances.at(linked)) return;
          distances.to(linked, currentDistance + 1);
          new_frontier.push(linked);
        });
      });
      frontier = new_frontier;
    }

    return distances;
  }
}

