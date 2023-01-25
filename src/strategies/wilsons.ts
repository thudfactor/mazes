import Cell from '../model/cell';
import Grid from '../model/grid';
import { arraySample } from '../util/index';

// Non-functioning, do not use
export default class Wilsons {
  // Walks through each cell of the maze step by step
  static * step(grid:Grid) {
    const unvisited: Cell[] = [];
    const gridGenerator = grid.eachCell();
    
    for (let c of gridGenerator) {
      if (c) unvisited.push(c);
    }

    const first = arraySample(unvisited);
    const firstIndex = unvisited.indexOf(first);
    unvisited.splice(firstIndex, 1);

    let counter = 0
    while (unvisited.length > 0 && counter < 18000) {
      let cell = arraySample(unvisited);
      const path = [cell];
      
      while (unvisited.includes(cell)) {
        cell = arraySample(Object.values(cell.neighbors).filter((v)=> {
          return (v !== null);
        }));
        const position = path.indexOf(cell);
        console.log(position, cell, path);
        if (position >= 0) {
          path.splice(position);
        } else {
          path.push(cell);
        }
      }
      //console.log('path length', path.length);

      let i = 0;
      do {
        if(!path[i + 1]) {
          console.log(path);
        } else {
          path[i].link(path[i+1]);
          unvisited.splice(unvisited.indexOf(path[i]), 1);  
        }
        i++;
      } while (i < path.length - 2);
      console.log('unvisited length', unvisited.length);
      counter++;
      yield grid;
    }
    console.log('counter', counter);
  }
  // executes all the steps at once
  static on(grid:Grid): Grid {
    const stepper = Wilsons.step(grid);
    let i = 0;
    // eslint-disable-next-line
    for (let s of stepper) {
      i += 1;
    }
    console.log(`Wilsons in ${i}`);
    return grid;
  }
}
