type OmitNullProps<T> = {
  [Key in keyof T as T[Key] extends {} ? Key : never]: T[Key];
};

/**
 * Removes null AND undefined properties from object
 */
export const omitNullProps = <T extends Record<string, unknown>>(obj: T): OmitNullProps<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined),
  ) as OmitNullProps<T>;
