import { Lang } from '../../../../../shared/interfaces/lang.enum';

export interface ICourseStepI18n {
  id: number;
  courseStepId: number;
  lang: Lang;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseStepI18nScopesMap = Record<string, never>;
