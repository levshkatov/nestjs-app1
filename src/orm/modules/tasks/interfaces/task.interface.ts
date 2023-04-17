import { BS } from '../../../shared/interfaces/scopes.interface';
import {
  IExerciseTask,
  ExerciseTaskScopesMap,
} from '../../exercises/tasks/interfaces/exercise-task.interface';
import { HabitScopesMap, IHabit } from '../../habits/interfaces/habit.interface';
import {
  IInterestingArticle,
  InterestingArticleScopesMap,
} from '../../interesting/articles/interfaces/interesting-article.interface';
import {
  IInterestingChecklist,
  InterestingChecklistScopesMap,
} from '../../interesting/checklists/interfaces/interesting-checklist.interface';
import { TaskCategoryName } from '../categories/interfaces/task-category.enum';
import { ITaskCategory } from '../categories/interfaces/task-category.interface';
import { ITaskI18n } from './task-i18n.interface';

export interface ITask {
  id: number;
  name: string;
  categoryName: TaskCategoryName;
  createdAt: Date;
  updatedAt: Date;

  i18n?: ITaskI18n[];
  category?: ITaskCategory;
  habits?: IHabit[];
  exerciseTasks?: IExerciseTask[];
  interestingArticles?: IInterestingArticle[];
  interestingChecklists?: IInterestingChecklist[];
}

export type TaskScopesMap = {
  i18n: ['i18n', undefined];
  category: ['category', undefined];
  categorySearch: ['category', undefined];
  habits: ['habits', BS<IHabit, HabitScopesMap, 'i18n'>[]];
  exerciseTasks: ['exerciseTasks', BS<IExerciseTask, ExerciseTaskScopesMap, 'exercise'>[]];
  interestingArticles: [
    'interestingArticles',
    BS<IInterestingArticle, InterestingArticleScopesMap, 'i18n'>[],
  ];
  interestingChecklists: [
    'interestingChecklists',
    BS<IInterestingChecklist, InterestingChecklistScopesMap, 'i18n'>[],
  ];
};
