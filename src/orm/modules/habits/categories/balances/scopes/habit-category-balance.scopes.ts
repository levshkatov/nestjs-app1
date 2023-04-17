import { TScopes } from '../../../../../shared/interfaces/scopes.interface';
import { HabitCategoryBalanceI18n } from '../habit-category-balance-i18n.model';
import {
  HabitCategoryBalanceScopesMap,
  IHabitCategoryBalance,
} from '../interfaces/habit-category-balance.interface';
import { i18nScope } from '../../../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../../../shared/scopes/photo.scope';
import { HabitCategory } from '../../habit-category.model';
import { setScope } from '../../../../../shared/helpers/set-scope.helper';
import { HabitCategoryScopesMap } from '../../interfaces/habit-category.interface';

export const habitCategoryBalanceScopes: TScopes<
  IHabitCategoryBalance,
  HabitCategoryBalanceScopesMap
> = {
  i18n: i18nScope(HabitCategoryBalanceI18n),
  photo: photoScope('photo'),
  habitCategory: () => ({
    include: {
      model: setScope<HabitCategory, keyof HabitCategoryScopesMap>(HabitCategory, [
        'i18n',
        'photo',
      ]),
    },
  }),
};
