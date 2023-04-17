import { setScope } from '../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { Habit } from '../../habits/habit.model';
import { HabitScopesMap } from '../../habits/interfaces/habit.interface';
import { Celebrity } from '../celebrity.model';
import { CelebrityHabitScopesMap, ICelebrityHabit } from '../interfaces/celebrity-habit.interface';
import { CelebrityScopesMap } from '../interfaces/celebrity.interface';

export const celebrityHabitScopes: TScopes<ICelebrityHabit, CelebrityHabitScopesMap> = {
  habit: () => ({
    include: {
      model: setScope<Habit, keyof HabitScopesMap>(Habit, ['i18n', 'category']),
    },
  }),
  celebrity: () => ({
    include: {
      model: setScope<Celebrity, keyof CelebrityScopesMap>(Celebrity, ['i18n']),
    },
  }),
};
