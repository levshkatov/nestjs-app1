import { IUser, UserScopesMap } from '../../../../orm/modules/users/interfaces/user.interface';
import { IUserSession } from '../../../../orm/modules/users/sessions/interfaces/user-session.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';

export interface ISession {
  userId: number;
  sessionId: number;
  refreshToken: string;
}

export interface ISessionWithUser {
  user: BS<IUser, UserScopesMap, 'profile'>;
  session: IUserSession;
}
