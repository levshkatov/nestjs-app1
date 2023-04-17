import { setScope } from '../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { Habit } from '../../habits/habit.model';
import { HabitScopesMap } from '../../habits/interfaces/habit.interface';
import { Course } from '../course.model';
import { CourseHabitScopesMap, ICourseHabit } from '../interfaces/course-habit.interface';
import { CourseScopesMap } from '../interfaces/course.interface';

export const courseHabitScopes: TScopes<ICourseHabit, CourseHabitScopesMap> = {
  habit: () => ({
    include: {
      model: setScope<Habit, keyof HabitScopesMap>(Habit, ['i18n', 'category']),
    },
  }),
  course: () => ({
    include: {
      model: setScope<Course, keyof CourseScopesMap>(Course, ['i18n']),
    },
  }),
};
