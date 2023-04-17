import { Lang } from '../../../../../../shared/interfaces/lang.enum';

export interface IHabitCategoryBalanceI18n {
  id: number;
  habitCategoryBalanceId: number;
  lang: Lang;
  iconName: string;
  iconCaption: string;
  iconClosedCaption: string;
  iconNewCaption: string;
  balanceCaptions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type HabitCategoryBalanceI18nScopesMap = Record<string, never>;
