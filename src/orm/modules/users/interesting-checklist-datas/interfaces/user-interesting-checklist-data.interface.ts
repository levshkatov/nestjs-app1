import { ITaskContent } from '../../../tasks/interfaces/task-i18n.interface';

export interface IUserInterestingChecklistData {
  userId: number;
  interestingChecklistId: number;
  content: ITaskContent[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserInterestingChecklistDataScopesMap = Record<string, never>;
