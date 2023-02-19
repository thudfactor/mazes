import { arrayOf, arraySample, randomFrom } from ".";

describe("arrayOf", () => {
  it("creates an array of five items", () => {
    const testArray = arrayOf(5);
    expect(testArray.length).toBe(5);
  });
  it("creates an array in order from 0 to 3", () => {
    const testArray = arrayOf(4);
    expect(testArray.toString() === [0, 1, 2, 3].toString()).toBeTruthy();
  });
});

describe("arraySample", () => {
  it("returns a random item from the array", () => {
    const array = ["f", "n", "o", "r", "d"];
    const sampleItem = arraySample(array);
    expect(array.includes(sampleItem)).toBeTruthy();
  });
});

describe("randomMax", () => {
  it("returns a random number between 0 and the max value, incluive of max", () => {
    let s = 2;
    let l = 2;
    for (let i = 0; i < 2000; i++) {
      const r = randomFrom(5);
      if (r < s) s = r;
      if (r > l) l = r;
    }
    expect(l).toBe(5);
    expect(s).toBe(0);
  });
});
