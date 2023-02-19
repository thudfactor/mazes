import { arrayOf, randomFrom } from "../util/index";
import Cell from "./cell";

export default class Grid {
  rows: number;
  columns: number;
  start: Cell;
  end: Cell;
  grid: Cell[][];
  solution: Cell[] | false;

  constructor(rows: number, columns: number, randomizeGoals: boolean = false) {
    this.rows = rows;
    this.columns = columns;
    this.grid = this.prepareGrid();
    this.configureCells();
    this.solution = false;

    this.getCellAt.bind(this);

    if (randomizeGoals) {
      const startCol = randomFrom(1) === 0 ? 0 : this.columns - 1;
      const endCol = startCol === 0 ? this.columns - 1 : 0;

      this.start = this.grid[randomFrom(this.rows - 1)][startCol];
      this.end = this.grid[randomFrom(this.rows - 1)][endCol];
    } else {
      this.start = this.grid[rows - 1][0];
      this.end = this.grid[0][columns - 1];
    }
  }

  prepareGrid(): Cell[][] {
    const rowIndicies = arrayOf(this.rows);
    const colIndicies = arrayOf(this.columns);
    const grid = rowIndicies.map((row: number) => {
      return colIndicies.map((col: number) => new Cell(row, col));
    });
    return grid;
  }

  configureCells() {
    const allCells = this.eachCell();
    for (let c of allCells) {
      if (!c) continue;
      const { row, column: col } = c;
      c.north = this.getCellAt(row - 1, col);
      c.south = this.getCellAt(row + 1, col);
      c.west = this.getCellAt(row, col - 1);
      c.east = this.getCellAt(row, col + 1);
    }
  }

  getCellAt(row: number, col: number) {
    if (row >= 0 && row < this.rows) {
      if (col >= 0 && col < this.columns) {
        return this.grid[row][col];
      }
    }
    return null;
  }

  random_cell(): Cell {
    const row = randomFrom(this.rows - 1);
    const col = randomFrom(this.columns - 1);
    return this.grid[row][col];
  }

  get size(): number {
    return this.rows * this.columns;
  }

  *eachRow() {
    for (let i = 0; i < this.rows; i++) {
      yield this.grid[i];
    }
  }

  *eachCell() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        yield this.getCellAt(i, j);
      }
    }
  }

  cellAtBoundaries(c: Cell) {
    return {
      northBoundary: !c.north,
      southBoundary: !c.south,
      eastBoundary: !c.east,
      westBoundary: !c.west,
    };
  }

  pathFrom(start: Cell, goal: Cell): Cell[] | false {
    let current = goal;
    const path = [goal];
    const distances = start.distances();
    while (!current.equals(start)) {
      let maybe;
      if (current.links.length === 0) {
        console.warn("no solution");
        return false;
      }
      for (let j = 0; j < current.links.length; j++) {
        let cell = current.links[j];
        if (distances.at(cell) < distances.at(current)) {
          maybe = cell;
          break;
        }
      }
      if (maybe) {
        current = maybe;
        path.push(current);
      }
    }
    return path;
  }

  longestPath(): Grid {
    const distances_1 = this.grid[0][0].distances();
    const newStart = distances_1.max.cell;
    const distances_2 = newStart.distances();
    const newEnd = distances_2.max.cell;
    this.start = newStart;
    this.end = newEnd;
    this.solution = false;
    this.solve();
    return this;
  }

  solve(): Cell[] | false {
    if (!this.solution) {
      this.solution = this.pathFrom(this.start, this.end);
    }
    return this.solution;
  }

  deadEnds(): number {
    let count = 0;
    const cellGenerator = this.eachCell();
    for (let cell of cellGenerator) {
      if (cell?.links.length === 1) {
        count++;
      }
    }
    return count;
  }

  // Default renderer; useful if running in a node context
  toString() {
    let output = `+${"---+".repeat(this.columns)}\n`;
    const rowGen = this.eachRow();
    for (let row of rowGen) {
      let top = "|";
      let bottom = "+";

      row.forEach((cell) => {
        const isStart = cell.equals(this.start);
        const isEnd = cell.equals(this.end);
        const { eastBoundary, southBoundary } = this.cellAtBoundaries(cell);
        let marker = " ";
        if (isStart) marker = "✬";
        if (isEnd) marker = "⦿";
        const body = ` ${marker} `;
        const east_boundary = eastBoundary ? "|" : " ";
        top += body + east_boundary;
        const south_boundary = southBoundary ? "---" : "   ";
        bottom += south_boundary + "+";
      });

      output += `${top}\n${bottom}\n`;
    }
    return output;
  }
}
