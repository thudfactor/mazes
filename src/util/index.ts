export const arrayOf = (val: number):number[] => {
  return [...Array(val).keys()];
}

export const arraySample = (array:any[]):any => {
  const index = randomFrom(array.length - 1);
  return array[index];
}

export const randomFrom = (max:number):number => {
  const result = Math.floor(Math.random() * (max + 1));
  return result;
}

// const maxWeight = 100;

// function * decayingWeightedRandom() {
//   const values = [0, 1];
//   const weights = [1, 1];
//   let cumulativeWeights = [1,2];

//   let lastIter: number = null;
  
//   while(true) {
//     let collector = 0;
//     const randomChoice = randomFrom(cumulativeWeights[1]) + 1;
//     const index = (cumulativeWeights[0] >= randomChoice) ? 0 : 1;
//     //console.log(randomChoice,cumulativeWeights,index);
//     let thisIter = values[index];
//     //we went the same direction last time
//     if (lastIter && lastIter === thisIter) {
//       weights[thisIter] = Math.floor(weights[thisIter] / 2);
//       console.log('same', thisIter, weights);
//     } else {
//       weights[thisIter] = maxWeight;
//       if(lastIter !== null) weights[lastIter] = 1;
//       console.log('different', thisIter, weights);
//     }
  
//     lastIter = thisIter;
//     cumulativeWeights = weights.map(v => {
//       let nextv = collector + v;
//       collector = nextv;
//       return nextv;
//     });
//     yield thisIter;
//   }
// }