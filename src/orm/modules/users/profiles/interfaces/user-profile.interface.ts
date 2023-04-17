export interface IUserProfile {
  userId: number;
  name: string;
  birthdate: Date | null;
  waterBalance: number;
  totalTasks: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfileScopesMap = Record<string, never>;
