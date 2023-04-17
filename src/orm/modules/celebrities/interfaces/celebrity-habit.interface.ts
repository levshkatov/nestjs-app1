import { BS } from '../../../shared/interfaces/scopes.interface';
import { IHabit, HabitScopesMap } from '../../habits/interfaces/habit.interface';
import { CelebrityScopesMap, ICelebrity } from './celebrity.interface';

export interface ICelebrityHabit {
  celebrityId: number;
  habitId: number;
  createdAt: Date;
  updatedAt: Date;

  habit?: IHabit;
  celebrity?: ICelebrity;
}

export type CelebrityHabitScopesMap = {
  habit: ['habit', BS<IHabit, HabitScopesMap, 'i18n' | 'category'>];
  celebrity: ['celebrity', BS<ICelebrity, CelebrityScopesMap, 'i18n'>];
};
