export const arrayOf = (val) => {
  return Array.from(Array(val).keys());
}

export const arraySample = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}