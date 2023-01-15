import Cell from './cell.ts';
import { arrayOf } from './util.js';

export default class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.grid = this.prepareGrid();
    this.configureCells();

    this.getCellAt.bind(this);
  }

  prepareGrid() {
    const rowIndicies = arrayOf(this.rows);
    const colIndicies = arrayOf(this.columns);
    const grid = rowIndicies.map((row) => {
      return colIndicies.map(col => new Cell(row, col));
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

  getCellAt(row, col) {
    if (row >= 0 && row < this.rows) {
      if (col >= 0 && col < this.columns) {
        return this.grid[row][col];
      }
    }
    return null;
  }

  random_cell() {
    const row = Math.floor(Math.random() * this.rows);
    const col = Math.floor(Math.random() * this.columns);
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

  toString() {
    let output = `+${"---+".repeat(this.columns)}\n`;
    const rowGen = this.eachRow();
    let row = rowGen.next().value;
    while (row) {
      let top = "|";
      let bottom = "+";
      
      row.forEach(cell => {
        const { east, south } = cell.neighbors;
        const body = "   ";
        const east_boundary = (east && cell.linked(east)) ? ' ' : '|';
        top += body + east_boundary;
        const south_boundary = (south && cell.linked(south)) ? '   ' : '---';
        bottom += south_boundary + '+';
      })

      output += `${top}\n${bottom}\n`;

      row = rowGen.next().value;
    }
    return output;
  }
}