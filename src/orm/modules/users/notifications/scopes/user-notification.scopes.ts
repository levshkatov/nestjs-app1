import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import {
  IUserNotification,
  UserNotificationScopesMap,
} from '../interfaces/user-notification.interface';

export const userNotificationScopes: TScopes<IUserNotification, UserNotificationScopesMap> = {};
