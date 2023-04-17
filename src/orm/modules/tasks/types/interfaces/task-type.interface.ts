import { Through, ThroughR } from '../../../../shared/interfaces/scopes.interface';
import { ITaskTypeInclude } from './task-type-include.interface';

export interface ITaskType {
  name: string;
  description: string;
  dataDescription: string | null;
  dataDefault: string | null;
  files: string[] | null;
  dataRequired: boolean;
  createdAt: Date;
  updatedAt: Date;

  include?: (ITaskType & Through<'TaskTypeInclude', ITaskTypeInclude>)[];
}

export type TaskTypeScopesMap = {
  include: ['include', (ITaskType & ThroughR<'TaskTypeInclude', ITaskTypeInclude>)[]];
};
