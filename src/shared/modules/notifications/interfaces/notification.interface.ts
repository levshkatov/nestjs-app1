import { SendResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { NotificationType } from '../../../../orm/modules/notifications/interfaces/notification-type.enum';
import { Lang } from '../../../interfaces/lang.enum';

export type NotificationData = {
  type: NotificationType;
  title: string;
  text: string;
  id?: string;
};

export interface IUserData {
  lang: Lang;
  userId: number;
  sessions: {
    id: number;
    token: string;
  }[];
  id?: number;
}

export interface IUserNotificationData {
  userId: number;
  sessionId: number;
  type: NotificationType;
  response: SendResponse;
}
