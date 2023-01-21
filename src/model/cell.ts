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

  set north(cell: Cell | null) {
    this.neighbors.north = cell;
  }

  get north(): Cell | null {
    return this.neighbors.north;
  }

  set south(cell: Cell | null) {
    this.neighbors.south = cell;
  }

  get south(): Cell | null {
    return this.neighbors.south;
  }

  set east(cell: Cell | null) {
    this.neighbors.east = cell;
  }

  get east(): Cell | null {
    return this.neighbors.east;
  }

  set west(cell: Cell | null) {
    this.neighbors.west = cell;
  }  

  get west(): Cell | null {
    return this.neighbors.west;
  }

  // Checks for equality with a cell by comparing the cells address
  equals(cell: Cell):boolean {
    return this.row === cell.row && this.column === cell.column;
  }

  link(cell: Cell, bidi = true) {
    if(!this.linked(cell)) {
      this.links.push(cell);
      bidi && cell.link(this, false);  
    }
  }

  unlink(cell: Cell, bidi = true) {
    const newLinks = this.links.filter((current) => (!cell.equals(current)));
    this.links = newLinks;
    bidi && cell.unlink(this, false);
  }

  linked(cell: Cell) {
    const found = this.links.find((current) => {
      return (current.equals(cell));
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
        cell.links.forEach((linked) => {
          const ld = distances.at(linked);
          if (ld >= 0) return;
          distances.to(linked, currentDistance + 1);
          new_frontier.push(linked);
        });
      });
      frontier = new_frontier;
    }

    return distances;
  }
}

