import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface ILevelI18n {
  id: number;
  levelId: number;
  lang: Lang;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LevelI18nScopesMap = Record<string, never>;
