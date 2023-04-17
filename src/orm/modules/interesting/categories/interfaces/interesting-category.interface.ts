import { IInterestingChecklist } from '../../checklists/interfaces/interesting-checklist.interface';
import { IInterestingCoaching } from '../../coachings/interfaces/interesting-coaching.interface';
import { IInterestingMeditation } from '../../meditations/interfaces/interesting-meditation.interface';
import { IInterestingCategoryI18n } from './interesting-category-i18n.interface';
import { InterestingCategoryType } from './interesting-category-type.enum';

export interface IInterestingCategory {
  id: number;
  type: InterestingCategoryType;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IInterestingCategoryI18n[];
  checklists?: IInterestingChecklist[];
  meditations?: IInterestingMeditation[];
  coachings?: IInterestingCoaching[];
}

export type InterestingCategoryScopesMap = {
  i18n: ['i18n', undefined];
  checklists: ['checklists', undefined];
  meditations: ['meditations', undefined];
  coachings: ['coachings', undefined];
};
