import { WhereOptions } from 'sequelize';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { searchScope } from '../../../../shared/scopes/search.scope';
import { TaskScopesMap } from '../../../tasks/interfaces/task.interface';
import { Task } from '../../../tasks/task.model';
import { Exercise } from '../../exercise.model';
import { ExerciseTaskScopesMap, IExerciseTask } from '../interfaces/exercise-task.interface';
import { ExerciseScopesMap } from '../../interfaces/exercise.interface';

export const exerciseTaskScopes: TScopes<IExerciseTask, ExerciseTaskScopesMap> = {
  task: () => ({
    include: {
      model: setScope<Task, keyof TaskScopesMap>(Task, ['i18n']),
    },
  }),
  taskSearch: (where?: WhereOptions<Task>[]) =>
    searchScope(setScope<Task, keyof TaskScopesMap>(Task, ['i18n']))(where),
  exercise: () => ({
    include: {
      model: setScope<Exercise, keyof ExerciseScopesMap>(Exercise, ['i18n']),
    },
  }),
};
