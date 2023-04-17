import { SocialType } from './social-type.enum';

export interface IUserSocial {
  userId: number;
  social: SocialType;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSocialScopesMap = Record<string, never>;
