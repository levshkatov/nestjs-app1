import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface IHabitI18n {
  id: number;
  habitId: number;
  lang: Lang;
  name: string;
  description: string;
  daypartDescription: string;
  goal: string;
  forWhom: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HabitI18nScopesMap = Record<string, never>;
