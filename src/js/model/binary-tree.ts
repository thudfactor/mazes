import Grid from './grid';
import { randomFrom } from '../util/index';

const maxWeight = 100;

function * decayingWeightedRandom() {
  const values = [0, 1];
  const weights = [1, 1];
  let cumulativeWeights = [1,2];

  let lastIter: number = null;
  
  while(true) {
    let collector = 0;
    const randomChoice = randomFrom(cumulativeWeights[1]) + 1;
    const index = (cumulativeWeights[0] >= randomChoice) ? 0 : 1;
    //console.log(randomChoice,cumulativeWeights,index);
    let thisIter = values[index];
    //we went the same direction last time
    if (lastIter && lastIter === thisIter) {
      weights[thisIter] = Math.floor(weights[thisIter] / 2);
      console.log('same', thisIter, weights);
    } else {
      weights[thisIter] = maxWeight;
      if(lastIter !== null) weights[lastIter] = 1;
      console.log('different', thisIter, weights);
    }
  
    lastIter = thisIter;
    cumulativeWeights = weights.map(v => {
      let nextv = collector + v;
      collector = nextv;
      return nextv;
    });
    yield thisIter;
  }
}

export default class BinaryTree {
  static on(grid:Grid) {
    const cellGenerator = grid.eachCell();
    let c = cellGenerator.next().value;
    const wallRandom = decayingWeightedRandom();
    while (c) {
      const { north, east } = c.neighbors;
      if (north && east) {
        const neighbors = [north, east];
        const randomNeighbor = neighbors[wallRandom.next().value];
        if (randomNeighbor) {
          c.link(randomNeighbor);
        }
      }
      if(!north && east) {
        c.link(east);
      }
      if(!east && north) {
        c.link(north);
      }
      c = cellGenerator.next().value;
    }
    return grid;
  }
}