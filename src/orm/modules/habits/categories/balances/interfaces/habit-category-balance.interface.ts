import { BS } from '../../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../../media/interfaces/media.interface';
import { HabitCategoryScopesMap, IHabitCategory } from '../../interfaces/habit-category.interface';
import { IHabitCategoryBalanceI18n } from './habit-category-balance-i18n.interface';

export interface IHabitCategoryBalance {
  habitCategoryId: number;
  photoId: number;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IHabitCategoryBalanceI18n[];
  photo?: IMedia;
  habitCategory?: IHabitCategory;
}

export type HabitCategoryBalanceScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  habitCategory: ['habitCategory', BS<IHabitCategory, HabitCategoryScopesMap, 'i18n' | 'photo'>];
};
