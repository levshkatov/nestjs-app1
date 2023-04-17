import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { CourseI18n } from '../course-i18n.model';
import { CourseScopesMap, ICourse } from '../interfaces/course.interface';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { CourseStep } from '../steps/course-step.model';
import { photoScope } from '../../../shared/scopes/photo.scope';
import { setScope } from '../../../shared/helpers/set-scope.helper';
import { CourseStepScopesMap } from '../steps/interfaces/course-step.interface';
import { CourseHabit } from '../course-habit.model';
import { CourseHabitScopesMap } from '../interfaces/course-habit.interface';
import { OrderItem, Sequelize } from 'sequelize';
import { searchScope } from '../../../shared/scopes/search.scope';

export const courseScopes: TScopes<ICourse, CourseScopesMap> = {
  i18n: i18nScope(CourseI18n),
  i18nSearch: searchScope(CourseI18n),
  photo: photoScope('photo'),
  photoInactive: photoScope('photoInactive'),
  courseHabits: () => ({
    include: {
      model: setScope<CourseHabit, keyof CourseHabitScopesMap>(CourseHabit, ['habit']),
    },
  }),
  steps: () => ({
    include: {
      model: setScope<CourseStep, keyof CourseStepScopesMap>(CourseStep, [
        'i18n',
        'photo',
        'courseStepLetters',
        'courseStepExercises',
      ]),
    },
  }),
  stepsSimple: () => ({
    include: {
      model: CourseStep.unscoped(),
    },
  }),
};

export const courseOrders: Record<'steps' | 'stepExercises' | 'stepExerciseTasks', OrderItem> = {
  steps: [Sequelize.literal(`"steps"."index"`), 'ASC'],
  stepExercises: [Sequelize.literal(`"steps->courseStepExercises"."index"`), 'ASC'],
  stepExerciseTasks: [
    Sequelize.literal(`"steps->courseStepExercises->exercise->exerciseTasks"."index"`),
    'ASC',
  ],
};
