import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface IInterestingChecklistI18n {
  id: number;
  interestingChecklistId: number;
  lang: Lang;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterestingChecklistI18nScopesMap = Record<string, never>;
