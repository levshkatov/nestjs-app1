import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface IHabitCategoryI18n {
  id: number;
  habitCategoryId: number;
  lang: Lang;
  name: string;
  habitCaption: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HabitCategoryI18nScopesMap = Record<string, never>;
