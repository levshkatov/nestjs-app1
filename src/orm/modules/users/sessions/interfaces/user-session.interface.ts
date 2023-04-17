export interface IUserSession {
  id: number;
  userId: number;
  refreshTokenHash: string;
  expireAt: Date;
  fcmToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSessionScopesMap = Record<string, never>;
