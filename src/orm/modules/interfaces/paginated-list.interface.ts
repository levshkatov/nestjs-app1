export type PaginatedList<K extends string, T> = {
  [k in K]: T[];
} & {
  pages: number;
  total: number;
};
