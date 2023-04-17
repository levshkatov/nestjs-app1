import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface IInterestingArticleI18n {
  id: number;
  interestingArticleId: number;
  lang: Lang;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterestingArticleI18nScopesMap = Record<string, never>;
