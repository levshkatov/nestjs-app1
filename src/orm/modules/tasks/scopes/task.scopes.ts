import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { ITask, TaskScopesMap } from '../interfaces/task.interface';
import { TaskI18n } from '../task-i18n.model';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { TaskCategory } from '../categories/task-category.model';
import { searchScope } from '../../../shared/scopes/search.scope';
import { setScope } from '../../../shared/helpers/set-scope.helper';
import { Habit } from '../../habits/habit.model';
import { HabitScopesMap } from '../../habits/interfaces/habit.interface';
import { ExerciseTask } from '../../exercises/tasks/exercise-task.model';
import { InterestingArticle } from '../../interesting/articles/interesting-article.model';
import { InterestingArticleScopesMap } from '../../interesting/articles/interfaces/interesting-article.interface';
import { InterestingChecklist } from '../../interesting/checklists/interesting-checklist.model';
import { InterestingChecklistScopesMap } from '../../interesting/checklists/interfaces/interesting-checklist.interface';
import { ExerciseTaskScopesMap } from '../../exercises/tasks/interfaces/exercise-task.interface';

export const taskScopes: TScopes<ITask, TaskScopesMap> = {
  i18n: i18nScope(TaskI18n),
  category: () => ({
    include: {
      model: TaskCategory.unscoped(),
    },
  }),
  categorySearch: searchScope(TaskCategory),
  habits: (notLinked = false) => {
    const extraOptions = notLinked ? { required: false, subQuery: true } : {};
    return {
      include: {
        model: setScope<Habit, keyof HabitScopesMap>(Habit, ['i18n']),
        ...extraOptions,
      },
    };
  },
  exerciseTasks: (notLinked = false) => {
    const extraOptions = notLinked ? { required: false, subQuery: true } : {};
    return {
      include: {
        model: setScope<ExerciseTask, keyof ExerciseTaskScopesMap>(ExerciseTask, ['exercise']),
        ...extraOptions,
      },
    };
  },
  interestingArticles: (notLinked = false) => {
    const extraOptions = notLinked ? { required: false, subQuery: true } : {};
    return {
      include: {
        model: setScope<InterestingArticle, keyof InterestingArticleScopesMap>(InterestingArticle, [
          'i18n',
        ]),
        ...extraOptions,
      },
    };
  },
  interestingChecklists: (notLinked = false) => {
    const extraOptions = notLinked ? { required: false, subQuery: true } : {};
    return {
      include: {
        model: setScope<InterestingChecklist, keyof InterestingChecklistScopesMap>(
          InterestingChecklist,
          ['i18n'],
        ),
        ...extraOptions,
      },
    };
  },
};
