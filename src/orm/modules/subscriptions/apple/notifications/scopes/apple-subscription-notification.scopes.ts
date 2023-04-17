import { TScopes } from '../../../../../shared/interfaces/scopes.interface';
import {
  AppleSubscriptionNotificationScopesMap,
  IAppleSubscriptionNotification,
} from '../interfaces/apple-subscription-notification.interface';

export const appleSubscriptionNotificationScopes: TScopes<
  IAppleSubscriptionNotification,
  AppleSubscriptionNotificationScopesMap
> = {};
