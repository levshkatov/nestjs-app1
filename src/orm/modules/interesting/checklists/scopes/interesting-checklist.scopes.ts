import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { InterestingChecklistI18n } from '../interesting-checklist-i18n.model';
import {
  IInterestingChecklist,
  InterestingChecklistScopesMap,
} from '../interfaces/interesting-checklist.interface';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import { Task } from '../../../tasks/task.model';
import { TaskScopesMap } from '../../../tasks/interfaces/task.interface';
import { InterestingCategory } from '../../categories/interesting-category.model';
import { InterestingCategoryScopesMap } from '../../categories/interfaces/interesting-category.interface';

export const interestingChecklistScopes: TScopes<
  IInterestingChecklist,
  InterestingChecklistScopesMap
> = {
  i18n: i18nScope(InterestingChecklistI18n),
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
  category: () => ({
    include: {
      model: setScope<InterestingCategory, keyof InterestingCategoryScopesMap>(
        InterestingCategory,
        ['i18n'],
      ),
    },
  }),
};
