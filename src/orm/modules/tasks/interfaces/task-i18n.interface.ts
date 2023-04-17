import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface ITaskI18n {
  id: number;
  taskId: number;
  lang: Lang;
  content: ITaskContent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskContent {
  type: string;
  data?: string;
  include?: ITaskContent[];
}

export type TaskI18nScopesMap = Record<string, never>;
