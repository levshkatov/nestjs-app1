export interface ITaskCategoryType {
  taskCategoryName: string;
  taskTypeName: string;
  required: boolean;
  maxElements: number;
  taskTypesExcluded: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCategoryTypeScopesMap = Record<string, never>;
