import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface ICelebrityI18n {
  id: number;
  celebrityId: number;
  lang: Lang;
  name: string;
  description: string;
  caption: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CelebrityI18nScopesMap = Record<string, never>;
