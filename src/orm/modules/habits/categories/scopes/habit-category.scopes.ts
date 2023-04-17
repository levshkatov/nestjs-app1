import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { HabitCategoryI18n } from '../habit-category-i18n.model';
import { HabitCategoryScopesMap, IHabitCategory } from '../interfaces/habit-category.interface';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { HabitCategoryBalance } from '../balances/habit-category-balance.model';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { HabitCategoryBalanceScopesMap } from '../balances/interfaces/habit-category-balance.interface';
import { Habit } from '../../habit.model';

export const habitCategoryScopes: TScopes<IHabitCategory, HabitCategoryScopesMap> = {
  i18n: i18nScope(HabitCategoryI18n),
  photo: photoScope('photo'),
  balance: () => ({
    include: {
      model: setScope<HabitCategoryBalance, keyof HabitCategoryBalanceScopesMap>(
        HabitCategoryBalance,
        ['i18n', 'photo'],
      ),
    },
  }),
  habits: () => ({
    include: {
      model: Habit.unscoped(),
    },
  }),
};
