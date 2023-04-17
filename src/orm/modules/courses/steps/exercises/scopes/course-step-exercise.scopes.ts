import { TScopes } from '../../../../../shared/interfaces/scopes.interface';
import {
  CourseStepExerciseScopesMap,
  ICourseStepExercise,
} from '../interfaces/course-step-exercise.interface';
import { setScope } from '../../../../../shared/helpers/set-scope.helper';
import { Exercise } from '../../../../exercises/exercise.model';
import { ExerciseScopesMap } from '../../../../exercises/interfaces/exercise.interface';
import { CourseStep } from '../../course-step.model';
import { CourseStepScopesMap } from '../../interfaces/course-step.interface';

export const courseStepExerciseScopes: TScopes<ICourseStepExercise, CourseStepExerciseScopesMap> = {
  exercise: () => ({
    include: {
      model: setScope<Exercise, keyof ExerciseScopesMap>(Exercise, ['i18n', 'exerciseTasks']),
    },
  }),
  exerciseNoTasks: () => ({
    include: {
      model: setScope<Exercise, keyof ExerciseScopesMap>(Exercise, ['i18n']),
    },
  }),
  courseStep: () => ({
    include: {
      model: setScope<CourseStep, keyof CourseStepScopesMap>(CourseStep, ['i18n', 'course']),
    },
  }),
};
