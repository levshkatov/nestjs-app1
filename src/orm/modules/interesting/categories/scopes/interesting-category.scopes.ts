import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { InterestingCategoryI18n } from '../interesting-category-i18n.model';
import {
  IInterestingCategory,
  InterestingCategoryScopesMap,
} from '../interfaces/interesting-category.interface';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { InterestingChecklist } from '../../checklists/interesting-checklist.model';
import { InterestingMeditation } from '../../meditations/interesting-meditation.model';
import { InterestingCoaching } from '../../coachings/interesting-coaching.model';

export const interestingCategoryScopes: TScopes<
  IInterestingCategory,
  InterestingCategoryScopesMap
> = {
  i18n: i18nScope(InterestingCategoryI18n),
  checklists: () => ({
    include: {
      model: InterestingChecklist.unscoped(),
    },
  }),
  meditations: () => ({
    include: {
      model: InterestingMeditation.unscoped(),
    },
  }),
  coachings: () => ({
    include: {
      model: InterestingCoaching.unscoped(),
    },
  }),
};
