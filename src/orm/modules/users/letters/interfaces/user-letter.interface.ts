export interface IUserLetter {
  userId: number;
  letterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserLetterScopesMap = Record<string, never>;
