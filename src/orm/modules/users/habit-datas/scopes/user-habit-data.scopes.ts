import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { Habit } from '../../../habits/habit.model';
import { HabitScopesMap } from '../../../habits/interfaces/habit.interface';
import { IUserHabitData, UserHabitDataScopesMap } from '../interfaces/user-habit-data.interface';

export const userHabitDataScopes: TScopes<IUserHabitData, UserHabitDataScopesMap> = {
  habit: () => ({
    include: {
      model: Habit.unscoped(),
    },
  }),
  habitNotes: () => ({
    include: {
      model: setScope<Habit, keyof HabitScopesMap>(Habit, ['i18n', 'taskNotes']),
    },
  }),
};
