import { INotificationI18n } from './notification-i18n.interface';
import { NotificationType } from './notification-type.enum';

export interface INotification {
  id: number;
  type: NotificationType;
  createdAt: Date;
  updatedAt: Date;

  i18n?: INotificationI18n[];
}

export type NotificationScopesMap = {
  i18n: ['i18n', undefined];
};
