import Distances from "./distances";

type Neighbors = {
  [key: string]: Cell | null;
};

export default class Cell {
  row: number;
  column: number;
  links: Cell[];
  north: Cell | null;
  south: Cell | null;
  east: Cell | null;
  west: Cell | null;
  private _distanceCache: Distances | null;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
    this.links = [];
    this.north = this.south = this.east = this.west = null;
    this._distanceCache = null;
  }

  // Checks for equality with a cell by comparing the cells address
  equals(cell: Cell): boolean {
    return this.row === cell.row && this.column === cell.column;
  }

  link(cell: Cell, bidi = true) {
    if (!this.linked(cell)) {
      this.links.push(cell);
      this._clearDistances();
      bidi && cell.link(this, false);
    }
  }

  unlink(cell: Cell, bidi = true) {
    const newLinks = this.links.filter((current) => !cell.equals(current));
    this.links = newLinks;
    bidi && cell.unlink(this, false);
  }

  linked(cell: Cell) {
    const found = this.links.find((current) => {
      return current.equals(cell);
    });
    return found instanceof Cell;
  }

  get neighbors(): Neighbors {
    return {
      north: this.north,
      south: this.south,
      east: this.east,
      west: this.west,
    };
  }

  /** Returns all of the neighbors that have not been visited (ie, have no links) */
  unvisitedNeighbors(): Cell[] {
    const neighbors = Object.values(this.neighbors);
    const unvisited = neighbors.filter((n) => {
      return n && n.links.length === 0;
    }) as Cell[]; // we filtering out the null values, but TS can't figure it out
    return unvisited || [];
  }

  private _clearDistances() {
    this._distanceCache = null;
  }

  // TODO: this allows a manual recalculation of distances
  // but it would be good to invalidate the cache if any linking
  // changes.
  distances(recalc = false): Distances {
    if (this._distanceCache && !recalc) return this._distanceCache;

    const distances = new Distances(this);
    let frontier = [this as Cell];

    while (frontier.length !== 0) {
      const new_frontier: Cell[] = [];
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
    this._distanceCache = distances;
    return distances;
  }
}
