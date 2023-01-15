import Cell from './cell';
import { arrayOf, arraySample, randomFrom } from '../util/index';

type CellAddress = {
  row: number;
  column: number;
}

export default class Grid {
  rows: number;
  columns: number;
  grid: Cell[][];
  start: CellAddress;
  end: CellAddress;

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.grid = this.prepareGrid();
    this.configureCells();

    this.getCellAt.bind(this);

    const startCol = (randomFrom(1) === 0) ? 0 : this.columns - 1;
    const endCol = (startCol === 0) ? this.columns - 1 : 0;

    this.start = {
      row: randomFrom(this.rows - 1),
      column: startCol
    }

    this.end = {
      row: randomFrom(this.rows - 1),
      column: endCol
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
    let c = allCells.next().value;
    while (c) {
      const {row, column: col} = c;
      c.neighbors = {
        north: this.getCellAt(row - 1,col),
        south: this.getCellAt(row + 1,col),
        west: this.getCellAt(row, col - 1),
        east: this.getCellAt(row, col + 1)
      }
      c = allCells.next().value;
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

  random_cell() {
    const row = randomFrom(this.rows - 1);
    const col = randomFrom(this.columns - 1);
    return this.grid[row][col];
  }

  get size() {
    return this.rows * this.columns;
  }

  * eachRow() {
    for(let i = 0; i < this.rows; i++) {
      yield this.grid[i];
    }
  }

  * eachCell() {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        yield this.getCellAt(i,j);
      }
    }
  }

  // Default renderer; useful if running in a node context
  toString() {
    let output = `+${"---+".repeat(this.columns)}\n`;
    const rowGen = this.eachRow();
    let row = rowGen.next().value;
    while (row) {
      let top = "|";
      let bottom = "+";
      
      row.forEach(cell => {
        const { east, south } = cell.neighbors;
        const isStart = cell.column === this.start.column && cell.row === this.start.row;
        const isEnd = cell.column === this.end.column && cell.row == this.end.row;
        let marker = ' ';
        if (isStart) marker = '✬';
        if (isEnd) marker = '⦿';
        const body = ` ${marker} `;
        const east_boundary = (east && cell.linked(east)) ? ' ' : '|';
        top += body + east_boundary;
        const south_boundary = (south && cell.linked(south)) ? '   ' : '---';
        bottom += south_boundary + '+';
      });

      output += `${top}\n${bottom}\n`;

      row = rowGen.next().value;
    }
    return output;
  }
}