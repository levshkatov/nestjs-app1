import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface IInterestingHelpI18n {
  id: number;
  interestingHelpId: number;
  lang: Lang;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterestingHelpI18nScopesMap = Record<string, never>;
