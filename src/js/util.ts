export const arrayOf = (val: number):number[] => {
  return [...Array(val).keys()];
}

export const arraySample = (array:any[]):any => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}