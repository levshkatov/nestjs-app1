import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface IExerciseI18n {
  id: number;
  exerciseId: number;
  lang: Lang;
  name: string;
  description: string;
  goal: string;
  author: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExerciseI18nScopesMap = Record<string, never>;
