import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { InterestingArticleI18n } from '../interesting-article-i18n.model';
import {
  IInterestingArticle,
  InterestingArticleScopesMap,
} from '../interfaces/interesting-article.interface';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import { Task } from '../../../tasks/task.model';
import { TaskScopesMap } from '../../../tasks/interfaces/task.interface';

export const interestingArticleScopes: TScopes<IInterestingArticle, InterestingArticleScopesMap> = {
  i18n: i18nScope(InterestingArticleI18n),
  photo: photoScope('photo'),
  task: () => ({
    include: {
      model: setScope<Task, keyof TaskScopesMap>(Task, ['i18n']),
    },
  }),
  taskSimple: () => ({
    include: {
      model: Task.unscoped(),
    },
  }),
};
