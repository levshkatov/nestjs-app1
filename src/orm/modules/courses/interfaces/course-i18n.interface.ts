import { Lang } from '../../../../shared/interfaces/lang.enum';
import { CourseExtraDescriptionType } from './course-extra-description-type.enum';

export interface ICourseI18n {
  id: number;
  courseId: number;
  lang: Lang;
  name: string;
  duration: string;
  description: string;
  extraDescription: ICourseExtraDescription[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseExtraDescription {
  title: string;
  type: CourseExtraDescriptionType;
  description: string[];
}

export type CourseI18nScopesMap = Record<string, never>;
