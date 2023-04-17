import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { HabitI18n } from '../habit-i18n.model';
import { HabitScopesMap, IHabit } from '../interfaces/habit.interface';
import { setScope } from '../../../shared/helpers/set-scope.helper';
import { Task } from '../../tasks/task.model';
import { HabitCategory } from '../categories/habit-category.model';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { HabitCategoryScopesMap } from '../categories/interfaces/habit-category.interface';
import { TaskScopesMap } from '../../tasks/interfaces/task.interface';
import { TaskCategoryName } from '../../tasks/categories/interfaces/task-category.enum';
import { searchScope } from '../../../shared/scopes/search.scope';
import { CelebrityHabit } from '../../celebrities/celebrity-habit.model';
import { CourseHabit } from '../../courses/course-habit.model';
import { WhereOptions } from 'sequelize';
import { CelebrityHabitScopesMap } from '../../celebrities/interfaces/celebrity-habit.interface';
import { CourseHabitScopesMap } from '../../courses/interfaces/course-habit.interface';

export const habitScopes: TScopes<IHabit, HabitScopesMap> = {
  i18n: i18nScope(HabitI18n),
  i18nSearch: searchScope(HabitI18n),
  category: () => ({
    include: {
      model: setScope<HabitCategory, keyof HabitCategoryScopesMap>(HabitCategory, [
        'i18n',
        'photo',
      ]),
    },
  }),
  task: () => ({
    include: {
      model: setScope<Task, keyof TaskScopesMap>(Task, ['i18n']),
    },
  }),
  taskNotes: () => ({
    include: {
      model: setScope<Task, keyof TaskScopesMap>(Task, ['i18n']),
      where: {
        categoryName: TaskCategoryName.notes,
      },
    },
  }),
  taskSearch: (where?: WhereOptions<Task>[]) =>
    searchScope(setScope<Task, keyof TaskScopesMap>(Task, ['i18n']))(where),
  celebrityHabits: () => ({
    include: {
      model: setScope<CelebrityHabit, keyof CelebrityHabitScopesMap>(CelebrityHabit, ['celebrity']),
    },
  }),
  courseHabits: () => ({
    include: {
      model: setScope<CourseHabit, keyof CourseHabitScopesMap>(CourseHabit, ['course']),
    },
  }),
};
