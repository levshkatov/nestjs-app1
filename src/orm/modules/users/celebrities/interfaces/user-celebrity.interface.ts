import { BS } from '../../../../shared/interfaces/scopes.interface';
import {
  CelebrityScopesMap,
  ICelebrity,
} from '../../../celebrities/interfaces/celebrity.interface';

export interface IUserCelebrity {
  userId: number;
  celebrityId: number;
  createdAt: Date;
  updatedAt: Date;

  celebrity?: ICelebrity;
}

export type UserCelebrityScopesMap = {
  celebrity: ['celebrity', BS<ICelebrity, CelebrityScopesMap, 'i18n' | 'photo'>];
};
