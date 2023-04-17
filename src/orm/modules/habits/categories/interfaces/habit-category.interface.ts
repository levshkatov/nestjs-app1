import { BS } from '../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';
import { IHabit } from '../../interfaces/habit.interface';
import {
  HabitCategoryBalanceScopesMap,
  IHabitCategoryBalance,
} from '../balances/interfaces/habit-category-balance.interface';
import { IHabitCategoryI18n } from './habit-category-i18n.interface';

export interface IHabitCategory {
  id: number;
  photoId: number;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IHabitCategoryI18n[];
  photo?: IMedia;
  balance?: IHabitCategoryBalance;
  habits?: IHabit[];
}

export type HabitCategoryScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  balance: ['balance', BS<IHabitCategoryBalance, HabitCategoryBalanceScopesMap, 'i18n' | 'photo'>];
  habits: ['habits', undefined];
};
