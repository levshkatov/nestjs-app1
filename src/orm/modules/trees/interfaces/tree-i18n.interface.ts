import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface ITreeI18n {
  id: number;
  treeId: number;
  lang: Lang;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TreeI18nScopesMap = Record<string, never>;
