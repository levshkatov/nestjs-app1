import { Lang } from '../../../../shared/interfaces/lang.enum';
import { UserRole } from './user-role.enum';

export interface UserOrmGetAllAdmin {
  type?: 'web' | 'mobile';
  role?: UserRole;
  id?: number;
  name?: string;
}

export interface UserHabitStartQueryRes {
  id: number;
  lang: Lang;
  habitId: number;
  sessionId: number;
  token: string;
}

export interface UserHabitStartRet {
  lang: Lang;
  sessions: {
    id: number;
    token: string;
  }[];
  id?: number;
}
