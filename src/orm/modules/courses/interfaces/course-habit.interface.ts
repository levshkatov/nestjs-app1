import { BS } from '../../../shared/interfaces/scopes.interface';
import { HabitScopesMap, IHabit } from '../../habits/interfaces/habit.interface';
import { CourseScopesMap, ICourse } from './course.interface';

export interface ICourseHabit {
  courseId: number;
  habitId: number;
  createdAt: Date;
  updatedAt: Date;

  habit?: IHabit;
  course?: ICourse;
}

export type CourseHabitScopesMap = {
  habit: ['habit', BS<IHabit, HabitScopesMap, 'i18n' | 'category'>];
  course: ['course', BS<ICourse, CourseScopesMap, 'i18n'>];
};
