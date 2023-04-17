import { Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { Op } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { NotificationType } from '../../../orm/modules/notifications/interfaces/notification-type.enum';
import { NotificationOrmService } from '../../../orm/modules/notifications/notification-orm.service';
import { IUserNotification } from '../../../orm/modules/users/notifications/interfaces/user-notification.interface';
import { UserNotificationOrmService } from '../../../orm/modules/users/notifications/user-notification-orm.service';
import { UserSessionOrmService } from '../../../orm/modules/users/sessions/user-session-orm.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { CreationAttributes } from '../../../orm/shared/interfaces/attributes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LoggerService } from '../logger/logger.service';
import { IUserData, IUserNotificationData } from './interfaces/notification.interface';
import { NotificationsMapper } from './notifications.mapper';

@Injectable()
export class NotificationsService {
  private env = process.env['NODE_ENV'];

  constructor(
    private notifications: NotificationOrmService,
    private notificationsMapper: NotificationsMapper,
    private users: UserOrmService,
    private userSessions: UserSessionOrmService,
    private userNotifications: UserNotificationOrmService,
    private logs: LoggerService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async sendToTokens(type: NotificationType, userData: IUserData[]): Promise<void> {
    const res: IUserNotificationData[] = [];
    if (this.env !== 'prod') {
      return;
    }
    if (!userData.length) {
      return;
    }

    try {
      const notification = await this.notifications.getOneRandom(type);
      if (!notification) {
        await this.logs.error([`DANGER! FCM. No notification, type: ${type}`]);
        return;
      }

      const messages = [];
      const messagesExtra = [];
      const chunkSize = 495;
      const chunkMessages: Message[] = [];
      const chunkMessagesExtra: { sessionId: number; userId: number }[] = [];

      for (const { lang, userId, id, sessions } of userData) {
        for (const { token, id: sessionId } of sessions) {
          chunkMessages.push({
            token,
            data: this.notificationsMapper.toNotificationData(lang, notification, id),
            fcmOptions: { analyticsLabel: type },
          });
          chunkMessagesExtra.push({
            sessionId,
            userId,
          });

          if (chunkMessages.length >= chunkSize) {
            messages.push([...chunkMessages]);
            messagesExtra.push([...chunkMessagesExtra]);
            chunkMessages.length = 0;
            chunkMessagesExtra.length = 0;
          }
        }
      }

      if (chunkMessages.length) {
        messages.push([...chunkMessages]);
        messagesExtra.push([...chunkMessagesExtra]);
      }

      const promises = messages.map((msg) => messaging().sendAll(msg));

      const batchResponses = await Promise.all(promises);
      for (const [i, { responses }] of batchResponses.entries()) {
        const extraArr = messagesExtra[i];
        if (!extraArr) {
          continue;
        }

        for (const [j, response] of responses.entries()) {
          const extra = extraArr[j];
          if (!extra) {
            continue;
          }

          const { sessionId, userId } = extra;
          res.push({ userId, sessionId, type, response });
        }
      }
    } catch (e) {
      await this.logs.error(
        e?.message && typeof e.message === 'string'
          ? [`DANGER! FCM. ${e.message}`]
          : ['DANGER! FCM. Unknown error'],
      );
    }

    return this.processResponse(res);
  }

  async sendToAllUsers(type: NotificationType, id?: number): Promise<void> {
    if (this.env !== 'prod') {
      return;
    }

    try {
      const users = await this.users.getAll(undefined, ['sessionsWithFcm']);
      await this.sendToTokens(
        type,
        users.map(({ id: userId, lang, sessions }) => ({
          userId,
          lang,
          sessions: sessions.map(({ id, fcmToken }) => ({ id, token: fcmToken })),
          id,
        })),
      );
    } catch (e) {}
  }

  private async processResponse(data: IUserNotificationData[]): Promise<void> {
    try {
      const sessionIdsToUpdate: number[] = [];

      const records: Optional<
        CreationAttributes<IUserNotification, 'id'>,
        NullishPropertiesOf<CreationAttributes<IUserNotification, 'id'>>
      >[] = [];

      for (const {
        userId,
        sessionId,
        type,
        response: { error, messageId },
      } of data) {
        if (
          error &&
          [
            'messaging/invalid-registration-token',
            'messaging/registration-token-not-registered',
          ].includes(error.code)
        ) {
          sessionIdsToUpdate.push(sessionId);
          continue;
        }

        records.push({
          userId,
          sessionId,
          type,
          messageString: messageId || null,
          messageId: messageId?.split('/')[3] || null,
          error: error ? `${error.code}\n${error.message}` : null,
        });
      }

      if (sessionIdsToUpdate.length) {
        await this.userSessions.update(
          { fcmToken: null },
          { where: { id: { [Op.in]: sessionIdsToUpdate } } },
        );
      }

      if (records.length) {
        await this.userNotifications.bulkCreate(records);
      }
    } catch (e) {}
  }

  // LEGACY for FCM topics
  // async sendToTopic(topic: NotificationType, id?: number) {
  //   if (this.env !== 'prod') {
  //     return;
  //   }

  //   try {
  //     const notification = await this.notifications.getOneRandom(topic);
  //     if (!notification) {
  //       return;
  //     }

  //     const data = this.notificationsMapper.toNotificationData(notification, id);

  //     const message: TopicMessage = {
  //       data,
  //       topic,
  //       fcmOptions: {
  //         analyticsLabel: topic,
  //       },
  //     };

  //     await messaging().send(message);
  //   } catch (e) {}
  // }

  // async subscribeToTopics(
  //   userId: number,
  //   token: string,
  //   topics: NotificationType[],
  // ): Promise<string[]> {
  //   if (this.env !== 'prod') {
  //     return [];
  //   }

  //   const retErrors: string[] = [];
  //   if (!topics.length) {
  //     return retErrors;
  //   }

  //   const promises = topics.map((topic) => messaging().subscribeToTopic(token, topic));
  //   const userFcmTopics: Pick<IUserFcmTopic, 'userId' | 'fcmToken' | 'type'>[] = [];

  //   const responses = await Promise.all(promises);
  //   for (const [i, { errors }] of responses.entries()) {
  //     const topic = topics[i];
  //     if (!topic) {
  //       retErrors.push(`Subscribe - no topic`);
  //       continue;
  //     }

  //     if (errors[0]) {
  //       const {
  //         error: { code, message },
  //       } = errors[0];

  //       retErrors.push(`${topic} - ${code} - ${message}`);
  //     } else {
  //       userFcmTopics.push({ userId, fcmToken: token, type: topic });
  //     }
  //   }

  //   await this.userTopics.bulkCreate(userFcmTopics);

  //   return retErrors;
  // }

  // async unsubscribeFromTopics(token: string, topics: NotificationType[]): Promise<string[]> {
  //   if (this.env !== 'prod') {
  //     return [];
  //   }

  //   const retErrors: string[] = [];
  //   if (!topics.length) {
  //     return retErrors;
  //   }

  //   const userTopics = await this.userTopics.getAll({ where: { fcmToken: token } });

  //   const promises = topics.map((topic) => messaging().unsubscribeFromTopic(token, topic));
  //   const topicsToDelete: NotificationType[] = [];
  //   const topicsToUpdate: Pick<IUserFcmTopic, 'id' | 'error' | 'fcmToken' | 'type'>[] = [];

  //   const responses = await Promise.all(promises);
  //   for (const [i, { errors }] of responses.entries()) {
  //     const topic = topics[i];
  //     if (!topic) {
  //       retErrors.push(`Unsubscribe - no topic`);
  //       continue;
  //     }

  //     if (errors[0]) {
  //       const {
  //         error: { code, message },
  //       } = errors[0];
  //       let error = `${topic} - ${code} - ${message}`;

  //       const userTopic = userTopics.find(({ type }) => type === topic);
  //       if (!userTopic) {
  //         error = `${error} - No userTopic`;
  //         retErrors.push(error);
  //         continue;
  //       }

  //       retErrors.push(error);
  //       topicsToUpdate.push({ id: userTopic.id, error, fcmToken: token, type: topic });
  //     } else {
  //       topicsToDelete.push(topic);
  //     }
  //   }

  //   if (topicsToUpdate.length) {
  //     await this.userTopics.bulkCreate(topicsToUpdate, { updateOnDuplicate: ['error'] });
  //   }

  //   if (topicsToDelete.length) {
  //     await this.userTopics.destroy({
  //       where: { fcmToken: token, type: { [Op.in]: topicsToDelete } },
  //     });
  //   }

  //   return retErrors;
  // }
}
