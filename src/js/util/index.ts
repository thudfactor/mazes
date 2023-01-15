export const arrayOf = (val: number):number[] => {
  return [...Array(val).keys()];
}

export const arraySample = (array:any[]):any => {
  const index = randomFrom(array.length - 1);
  return array[index];
}

export const randomFrom = (max:number):number => {
  return Math.floor(Math.random() * (max + 1));
}