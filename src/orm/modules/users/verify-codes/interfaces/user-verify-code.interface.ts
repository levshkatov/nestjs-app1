export interface IUserVerifyCode {
  userId: number;
  code: number;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserVerifyCodeScopesMap = Record<string, never>;
