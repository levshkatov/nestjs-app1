import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface IInterestingAudioI18n {
  id: number;
  interestingAudioId: number;
  lang: Lang;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterestingAudioI18nScopesMap = Record<string, never>;
