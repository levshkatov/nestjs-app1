import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface IInterestingCategoryI18n {
  id: number;
  interestingCategoryId: number;
  lang: Lang;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterestingCategoryI18nScopesMap = Record<string, never>;
