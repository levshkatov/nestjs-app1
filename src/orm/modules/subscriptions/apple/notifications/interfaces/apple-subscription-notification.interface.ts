import {
  AppStoreNotificationRenewalInfo,
  AppStoreNotificationTransactionInfo,
  Data,
} from './app-store-connect-notifications';

export interface IAppleSubscriptionNotification {
  id: number;
  originalTransactionId: string;
  notificationType: string;
  subtype: string | null;
  notificationUUID: string;
  renewalInfo: AppStoreNotificationRenewalInfo | null;
  transactionInfo: AppStoreNotificationTransactionInfo;
  createdAt: Date;
  updatedAt: Date;
}

export type AppleSubscriptionNotificationScopesMap = Record<string, never>;
