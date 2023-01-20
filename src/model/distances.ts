import Cell from "./cell";

class Distances {
  root: Cell;
  cellMap: Map<Cell, number>;

  constructor(root:Cell) {
    this.root = root;
    this.cellMap.set(root, 0);
  }

  get cells() {
    return this.cellMap.keys();
  }

  at(target:Cell):number {
    return this.cellMap.get(target);
  }

  to(cell: Cell, distance: number) {
    this.cellMap.set(cell, distance);
  }
}

export default Distances;