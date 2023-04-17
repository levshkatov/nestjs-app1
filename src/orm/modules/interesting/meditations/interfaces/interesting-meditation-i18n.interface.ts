import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface IInterestingMeditationI18n {
  id: number;
  interestingMeditationId: number;
  lang: Lang;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterestingMeditationI18nScopesMap = Record<string, never>;
