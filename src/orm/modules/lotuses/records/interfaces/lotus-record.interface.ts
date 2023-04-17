export interface ILotusRecord {
  id: number;
  userId: number;
  record: number;
  createdAt: Date;
  updatedAt: Date;
}

export type LotusRecordScopesMap = Record<string, never>;
