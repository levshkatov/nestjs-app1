export interface IUserBalance {
  userId: number;
  habitCategoryBalanceId: number;
  total: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserBalanceScopesMap = Record<string, never>;
