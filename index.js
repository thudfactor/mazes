import Grid from './grid.js';

const foo = new Grid(4,4);

console.log(foo.getCellAt(3,2)?.neighbors);
console.log(foo.random_cell());
