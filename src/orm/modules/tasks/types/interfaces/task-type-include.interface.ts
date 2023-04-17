export interface ITaskTypeInclude {
  taskTypeName: string;
  taskTypeIncludeName: string;
  required: boolean;
  maxElements: number;
  index: number;
  taskTypesExcluded: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskTypeIncludeScopesMap = Record<string, never>;
