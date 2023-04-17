export interface IUserClaim {
  id: number;
  userId: number;
  name: string;
  email: string;
  text: string;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserClaimScopesMap = Record<string, never>;
