import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface IStringI18n {
  id: number;
  stringName: string;
  lang: Lang;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export type StringI18nScopesMap = Record<string, never>;
