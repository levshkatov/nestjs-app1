import { BS } from '../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';
import { ITask, TaskScopesMap } from '../../../tasks/interfaces/task.interface';
import { IInterestingArticleI18n } from './interesting-article-i18n.interface';

export interface IInterestingArticle {
  id: number;
  photoId: number;
  taskId: number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IInterestingArticleI18n[];
  photo?: IMedia;
  task?: ITask;
}

export type InterestingArticleScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  task: ['task', BS<ITask, TaskScopesMap, 'i18n'>];
  taskSimple: ['task', undefined];
};
