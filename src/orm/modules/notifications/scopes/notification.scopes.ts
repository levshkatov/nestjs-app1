import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { INotification, NotificationScopesMap } from '../interfaces/notification.interface';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { NotificationI18n } from '../notification-i18n.model';

export const notificationScopes: TScopes<INotification, NotificationScopesMap> = {
  i18n: i18nScope(NotificationI18n),
};
