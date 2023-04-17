import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { CourseStepI18n } from '../course-step-i18n.model';
import { CourseStepScopesMap, ICourseStep } from '../interfaces/course-step.interface';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import { CourseStepLetterScopesMap } from '../interfaces/course-step-letter.interface';
import { CourseStepLetter } from '../course-step-letter.model';
import { OrderItem, Sequelize } from 'sequelize';
import { Course } from '../../course.model';
import { CourseScopesMap } from '../../interfaces/course.interface';
import { CourseStepExercise } from '../exercises/course-step-exercise.model';
import { CourseStepExerciseScopesMap } from '../exercises/interfaces/course-step-exercise.interface';

export const courseStepScopes: TScopes<ICourseStep, CourseStepScopesMap> = {
  i18n: i18nScope(CourseStepI18n),
  photo: photoScope('photo'),
  courseStepLetters: () => ({
    include: {
      model: setScope<CourseStepLetter, keyof CourseStepLetterScopesMap>(CourseStepLetter, [
        'letter',
      ]),
    },
  }),
  courseStepExercises: () => ({
    include: {
      model: setScope<CourseStepExercise, keyof CourseStepExerciseScopesMap>(CourseStepExercise, [
        'exercise',
      ]),
    },
  }),
  courseStepExercisesNoTasks: () => ({
    include: {
      model: setScope<CourseStepExercise, keyof CourseStepExerciseScopesMap>(CourseStepExercise, [
        'exerciseNoTasks',
      ]),
    },
  }),
  course: () => ({
    include: {
      model: setScope<Course, keyof CourseScopesMap>(Course, ['i18n']),
    },
  }),
};

export const courseStepOrders: Record<'stepExercises' | 'stepExerciseTasks', OrderItem> = {
  stepExercises: [Sequelize.literal(`"courseStepExercises"."index"`), 'ASC'],
  stepExerciseTasks: [
    Sequelize.literal(`"courseStepExercises->exercise->exerciseTasks"."index"`),
    'ASC',
  ],
};
