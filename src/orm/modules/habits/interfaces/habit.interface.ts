import { BS } from '../../../shared/interfaces/scopes.interface';
import {
  CelebrityHabitScopesMap,
  ICelebrityHabit,
} from '../../celebrities/interfaces/celebrity-habit.interface';
import {
  CourseHabitScopesMap,
  ICourseHabit,
} from '../../courses/interfaces/course-habit.interface';
import { ITask, TaskScopesMap } from '../../tasks/interfaces/task.interface';
import {
  HabitCategoryScopesMap,
  IHabitCategory,
} from '../categories/interfaces/habit-category.interface';
import { HabitDaypart } from './habit-daypart.enum';
import { IHabitI18n } from './habit-i18n.interface';

export interface IHabit {
  id: number;
  categoryId: number;
  taskId: number;
  disabled: boolean;
  time: string;
  daypart: HabitDaypart;
  countdown: string | null;
  index: number | null;
  tag: string | null;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IHabitI18n[];
  category?: IHabitCategory;
  task?: ITask;
  celebrityHabits?: ICelebrityHabit[];
  courseHabits?: ICourseHabit[];
}

export type HabitScopesMap = {
  i18n: ['i18n', undefined];
  i18nSearch: ['i18n', undefined];
  category: ['category', BS<IHabitCategory, HabitCategoryScopesMap, 'i18n' | 'photo'>];
  task: ['task', BS<ITask, TaskScopesMap, 'i18n'>];
  taskNotes: ['task', BS<ITask, TaskScopesMap, 'i18n'>];
  taskSearch: ['task', undefined];
  celebrityHabits: ['celebrityHabits', BS<ICelebrityHabit, CelebrityHabitScopesMap, 'celebrity'>[]];
  courseHabits: ['courseHabits', BS<ICourseHabit, CourseHabitScopesMap, 'course'>[]];
};
