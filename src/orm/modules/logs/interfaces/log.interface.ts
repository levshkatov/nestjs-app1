export interface ILog {
  id: number;
  ipAddr: string | null;
  method: string | null;
  url: string | null;
  userId: number | null;
  username: string | null;
  role: string | null;
  reqLength: number | null;
  resLength: number | null;
  resStatus: number | null;
  resStatusMessage: string | null;
  resTime: number | null;
  reqType: string | null;
  reqBody: any | null;
  extra: string | null;
  errors: string[] | null;
  serverError: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export type LogScopesMap = Record<string, never>;
