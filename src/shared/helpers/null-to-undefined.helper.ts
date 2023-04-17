export const nullToUndefined = <T>(data: T): (T & {}) | undefined =>
  data === null ? undefined : data;
