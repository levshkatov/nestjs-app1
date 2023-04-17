import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface ILetterI18n {
  id: number;
  letterId: number;
  lang: Lang;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LetterI18nScopesMap = Record<string, never>;
