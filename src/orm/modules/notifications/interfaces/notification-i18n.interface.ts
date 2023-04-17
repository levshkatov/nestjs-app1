import { Lang } from '../../../../shared/interfaces/lang.enum';

export interface INotificationI18n {
  id: number;
  notificationId: number;
  lang: Lang;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationI18nScopesMap = Record<string, never>;
