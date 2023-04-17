import { BS } from '../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';
import { ITask, TaskScopesMap } from '../../../tasks/interfaces/task.interface';
import {
  IInterestingCategory,
  InterestingCategoryScopesMap,
} from '../../categories/interfaces/interesting-category.interface';
import { IInterestingChecklistI18n } from './interesting-checklist-i18n.interface';

export interface IInterestingChecklist {
  id: number;
  categoryId: number;
  photoId: number;
  taskId: number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IInterestingChecklistI18n[];
  photo?: IMedia;
  task?: ITask;
  category?: IInterestingCategory;
}

export type InterestingChecklistScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  task: ['task', BS<ITask, TaskScopesMap, 'i18n'>];
  taskSimple: ['task', undefined];
  category: ['category', BS<IInterestingCategory, InterestingCategoryScopesMap, 'i18n'>];
};
