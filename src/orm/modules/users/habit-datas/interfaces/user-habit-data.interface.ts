import { BS } from '../../../../shared/interfaces/scopes.interface';
import { HabitScopesMap, IHabit } from '../../../habits/interfaces/habit.interface';
import { ITaskContent } from '../../../tasks/interfaces/task-i18n.interface';

export interface IUserHabitData {
  id: number;
  userId: number;
  habitId: number;
  content: ITaskContent[];
  createdAt: Date;
  updatedAt: Date;

  habit?: IHabit;
}

export type UserHabitDataScopesMap = {
  habit: ['habit', undefined];
  habitNotes: ['habit', BS<IHabit, HabitScopesMap, 'taskNotes' | 'i18n'>];
};
