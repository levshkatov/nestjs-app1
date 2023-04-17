import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { I18nContext } from 'nestjs-i18n';
import { UserSessionOrmService } from '../../../../orm/modules/users/sessions/user-session-orm.service';
import { UserOrmService } from '../../../../orm/modules/users/user-orm.service';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { AuthBaseService } from '../../../../shared/modules/auth/auth-base.service';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { CryptoHelperService } from '../../../../shared/modules/crypto/crypto-helper.service';
import { LoggerService } from '../../../../shared/modules/logger/logger.service';
import { NotificationsService } from '../../../../shared/modules/notifications/notifications.service';
import { PopUpService } from '../../pop-up/pop-up.service';
import { FcmCreateReqDto, FcmDeleteReqDto } from './dtos/auth-token.dto';

@Injectable()
export class AuthTokensService extends AuthBaseService {
  constructor(
    private popup: PopUpService,
    jwtService: JwtService,
    crypto: CryptoHelperService,
    config: ConfigService,
    users: UserOrmService,
    userSessions: UserSessionOrmService,
    logs: LoggerService,
    notifications: NotificationsService,
  ) {
    super(jwtService, crypto, config, users, userSessions, logs, notifications);
    logClassName(this.constructor.name, __filename);
  }

  async create(
    i18n: I18nContext,
    { fcmToken, refreshToken, sessionId }: FcmCreateReqDto,
    { userId }: IJWTUser,
  ): Promise<OkDto> {
    try {
      await this.validateSession({ userId, sessionId, refreshToken });
    } catch (e) {
      throw this.popup.error(i18n, `tokens.fcmError`, e.message ? [e.message] : []);
    }

    await this.userSessions.update({ fcmToken }, { where: { id: sessionId } });

    return new OkDto();
  }

  async delete(
    i18n: I18nContext,
    { refreshToken, sessionId }: FcmDeleteReqDto,
    { userId }: IJWTUser,
  ): Promise<OkDto> {
    try {
      await this.validateSession({ userId, sessionId, refreshToken });
    } catch (e) {
      throw this.popup.error(i18n, `tokens.fcmError`, e.message ? [e.message] : []);
    }

    await this.userSessions.update({ fcmToken: null }, { where: { id: sessionId } });

    return new OkDto();
  }

  // LEGACY for FCM topics
  // async createOld(
  //   i18n: I18nContext,
  //   { fcmToken, refreshToken, sessionId }: FcmCreateReqDto,
  //   { userId, role }: IJWTUser,
  // ): Promise<OkDto> {
  //   let oldFcmToken = null;
  //   try {
  //     const { session } = await this.validateSession({ userId, sessionId, refreshToken });
  //     oldFcmToken = session.fcmToken;
  //   } catch (e) {
  //     throw this.popup.error(i18n, `tokens.fcmError`, e.message ? [e.message] : []);
  //   }

  //   const topics =
  //     role === UserRole.mobileUnsubscribed
  //       ? Object.values(NotificationType).filter(
  //           (value) => ![NotificationType.habitStart, NotificationType.taskStart].includes(value),
  //         )
  //       : Object.values(NotificationType).filter(
  //           (value) =>
  //             ![
  //               NotificationType.habitStart,
  //               NotificationType.taskStart,
  //               NotificationType.notPaidMorning,
  //             ].includes(value),
  //         );

  //   if (fcmToken !== oldFcmToken) {
  //     if (oldFcmToken) {
  //       const errors = await this.notifications.unsubscribeFromTopics(
  //         oldFcmToken,
  //         Object.values(NotificationType),
  //       );
  //       if (errors.length) {
  //         await this.logs.error(errors.map((el) => `DANGER! FCM unsubscribe: ${el}`));
  //       }
  //     }

  //     const errors = await this.notifications.subscribeToTopics(userId, fcmToken, topics);
  //     if (errors.length) {
  //       throw this.popup.error(i18n, `tokens.fcmSubscribeError`, errors);
  //     }

  //     await this.userSessions.update({ fcmToken }, { where: { id: sessionId } });
  //   }

  //   return new OkDto();
  // }

  // async deleteOld(
  //   i18n: I18nContext,
  //   { refreshToken, sessionId }: FcmDeleteReqDto,
  //   { userId }: IJWTUser,
  // ): Promise<OkDto> {
  //   let fcmToken: string | null = null;
  //   try {
  //     const { session } = await this.validateSession({ userId, sessionId, refreshToken });
  //     fcmToken = session.fcmToken;
  //   } catch (e) {
  //     throw this.popup.error(i18n, `tokens.fcmError`, e.message ? [e.message] : []);
  //   }

  //   if (!fcmToken) {
  //     return new OkDto();
  //   }

  //   const errors = await this.notifications.unsubscribeFromTopics(
  //     fcmToken,
  //     Object.values(NotificationType),
  //   );
  //   if (errors.length) {
  //     await this.logs.error(errors.map((el) => `DANGER! FCM unsubscribe: ${el}`));
  //   }

  //   await this.userSessions.update({ fcmToken: null }, { where: { id: sessionId } });

  //   return new OkDto();
  // }
}
