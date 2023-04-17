import { NotificationType } from '../../../notifications/interfaces/notification-type.enum';

export interface IUserNotification {
  id: number;
  userId: number;
  sessionId: number;
  type: NotificationType;
  messageString: string | null;
  messageId: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserNotificationScopesMap = Record<string, never>;
