import Cell from "./cell";

class Distances {
  root: Cell;
  cellMap: Map<Cell, number>;
  maxDistance: number;

  constructor(root:Cell) {
    this.root = root;
    this.cellMap = new Map();
    this.cellMap.set(root, 0);
    this.maxDistance = 0;
  }

  cells() {
    return this.cellMap.keys();
  }

  at(target:Cell):number {
    const f = this.cellMap.get(target);
    return (f !== undefined) ? f : -1;
  }

  to(cell: Cell, distance: number) {
    this.cellMap.set(cell, distance);
    if (distance > this.maxDistance) {
      this.maxDistance = distance;
    }
  }
}

export default Distances;
