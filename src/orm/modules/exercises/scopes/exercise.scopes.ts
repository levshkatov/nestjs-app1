import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { ExerciseI18n } from '../exercise-i18n.model';
import { ExerciseScopesMap, IExercise } from '../interfaces/exercise.interface';
import { setScope } from '../../../shared/helpers/set-scope.helper';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { ExerciseTask } from '../tasks/exercise-task.model';
import { OrderItem, Sequelize, WhereOptions } from 'sequelize';
import { InterestingCoaching } from '../../interesting/coachings/interesting-coaching.model';
import { searchScope } from '../../../shared/scopes/search.scope';
import { ExerciseTaskScopesMap } from '../tasks/interfaces/exercise-task.interface';
import { CourseStepExercise } from '../../courses/steps/exercises/course-step-exercise.model';
import { CourseStepExerciseScopesMap } from '../../courses/steps/exercises/interfaces/course-step-exercise.interface';

export const exerciseScopes: TScopes<IExercise, ExerciseScopesMap> = {
  i18n: i18nScope(ExerciseI18n),
  i18nSearch: searchScope(ExerciseI18n),
  exerciseTasks: () => ({
    include: {
      model: setScope<ExerciseTask, keyof ExerciseTaskScopesMap>(ExerciseTask, ['task']),
    },
  }),
  exerciseTasksSearch: (where?: WhereOptions<ExerciseTask>[]) =>
    searchScope(setScope<ExerciseTask, keyof ExerciseTaskScopesMap>(ExerciseTask, ['task']))(where),
  courseStepExercises: () => ({
    include: {
      model: setScope<CourseStepExercise, keyof CourseStepExerciseScopesMap>(CourseStepExercise, [
        'courseStep',
      ]),
    },
  }),
  interestingCoachings: () => ({
    include: {
      model: InterestingCoaching.unscoped(),
    },
  }),
};

export const exerciseOrders: Record<'exerciseTasks', OrderItem> = {
  exerciseTasks: [Sequelize.literal(`"exerciseTasks"."index"`), 'ASC'],
};
