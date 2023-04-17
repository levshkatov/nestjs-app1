import { BS, Through, ThroughR } from '../../../../shared/interfaces/scopes.interface';
import { ITaskType, TaskTypeScopesMap } from '../../types/interfaces/task-type.interface';
import { ITaskCategoryType } from './task-category-type.interface';
import { TaskCategoryName } from './task-category.enum';

export interface ITaskCategory {
  name: TaskCategoryName;
  forHabits: boolean;
  forExercises: boolean;
  createdAt: Date;
  updatedAt: Date;

  taskTypes?: (ITaskType & Through<'TaskCategoryType', ITaskCategoryType>)[];
}

export type TaskCategoryScopesMap = {
  taskTypes: [
    'taskTypes',
    (BS<ITaskType, TaskTypeScopesMap, 'include'> &
      ThroughR<'TaskCategoryType', ITaskCategoryType>)[],
  ];
};
