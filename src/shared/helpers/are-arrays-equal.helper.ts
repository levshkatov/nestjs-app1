/**
 * With unique=true checks only unique values: [1,2,2]=[2,1,1]
 */
export const areArraysEqual = (arr1: number[], arr2: number[], unique = true): boolean => {
  if (!arr1.length || arr1.length !== arr2.length) {
    return false;
  }
  const sorted1 = Array.from(
    unique ? new Set(arr1.sort((a, b) => a - b)) : arr1.sort((a, b) => a - b),
  );
  const sorted2 = Array.from(
    unique ? new Set(arr2.sort((a, b) => a - b)) : arr2.sort((a, b) => a - b),
  );

  if (sorted1.length !== sorted2.length) {
    return false;
  }

  for (const [i, el] of sorted1.entries()) {
    if (!el || el !== sorted2[i]) {
      return false;
    }
  }

  return true;
};
