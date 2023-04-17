import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { CommonConfig } from '../../../config/interfaces/common';
import { IUser, UserScopesMap } from '../../../orm/modules/users/interfaces/user.interface';
import { IUserSession } from '../../../orm/modules/users/sessions/interfaces/user-session.interface';
import { UserSessionOrmService } from '../../../orm/modules/users/sessions/user-session-orm.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { LoggerService } from '../logger/logger.service';
import { CryptoHelperService } from '../crypto/crypto-helper.service';
import { IJWTUser } from './interfaces/jwt-user.interface';
import { ITokens } from './interfaces/jwt.interface';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { ISignOut } from './interfaces/sign-out.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { ISession, ISessionWithUser } from './interfaces/session.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../../orm/modules/notifications/interfaces/notification-type.enum';

export class AuthBaseService {
  constructor(
    protected jwtService: JwtService,
    protected crypto: CryptoHelperService,
    protected config: ConfigService,
    protected users: UserOrmService,
    protected userSessions: UserSessionOrmService,
    protected logs: LoggerService,
    protected notifications: NotificationsService,
  ) {}

  /**
   * @throws {Error}
   */
  protected async refreshTokensBase(
    dto: ISession,
  ): Promise<[ITokens, BS<IUser, UserScopesMap, 'profile'>]> {
    const { user, session } = await this.validateSession(dto);

    const tokens = await this.createTokens(user, session);

    return [tokens, user];
  }

  /**
   * @throws {Error}
   */
  protected async validateSession({
    userId,
    sessionId,
    refreshToken,
  }: ISession): Promise<ISessionWithUser> {
    const user = await this.users.getOne({ where: { id: userId } }, ['profile']);
    if (!user) {
      throw Error(`No user. sessionId: ${sessionId}, userId: ${userId}`);
    }

    const session = await this.userSessions.getOne({
      where: { id: sessionId, userId },
    });
    if (!session) {
      throw Error(`No session. sessionId: ${sessionId}, userId: ${userId}`);
    }

    const isValid = await this.crypto.verify(refreshToken, session.refreshTokenHash);
    if (!isValid) {
      // LEGACY for FCM topics
      // if (session.fcmToken) {
      //   await this.notifications.unsubscribeFromTopics(
      //     session.fcmToken,
      //     Object.values(NotificationType),
      //   );
      // }
      await this.userSessions.destroy({ where: { id: sessionId, userId } });
      throw Error(`DANGER! Wrong refresh token. sessionId: ${sessionId}, userId: ${userId}`);
    }

    if (new Date() > new Date(session.expireAt)) {
      throw Error(`Refresh token expired. sessionId: ${sessionId}, userId: ${userId}`);
    }

    return { user, session };
  }

  protected async signOutBase(
    { refreshToken, sessionId }: ISignOut,
    { userId }: IJWTUser,
  ): Promise<void> {
    const session = await this.userSessions.getOne({
      where: { id: sessionId, userId },
    });
    if (!session) {
      return;
    }

    const isValid = await this.crypto.verify(refreshToken, session.refreshTokenHash);
    if (!isValid) {
      await this.logs.error([
        `DANGER! Wrong refresh token. sessionId: ${sessionId}, userId: ${userId}`,
      ]);
    }

    // LEGACY for FCM topics
    // if (session.fcmToken) {
    //   await this.notifications.unsubscribeFromTopics(
    //     session.fcmToken,
    //     Object.values(NotificationType),
    //   );
    // }
    await this.userSessions.destroy({ where: { id: sessionId, userId } });
  }

  /**
   * @throws {Error}
   */
  protected async createTokens(
    { id: userId, role, profile, offsetUTC, lang }: BS<IUser, UserScopesMap, 'profile'>,
    sessionToUpdate?: IUserSession,
  ): Promise<ITokens> {
    const { refreshToken, refreshTokenHash, refreshTokenExpireAt } =
      await this.generateRefreshToken();

    let sessionId: number;
    if (sessionToUpdate) {
      await this.userSessions.update(
        { refreshTokenHash, expireAt: refreshTokenExpireAt },
        { where: { id: sessionToUpdate.id } },
      );
      sessionId = sessionToUpdate.id;
    } else {
      const session = await this.userSessions.create({
        userId,
        refreshTokenHash,
        expireAt: refreshTokenExpireAt,
      });
      sessionId = session.id;
    }

    const name = profile.name || this.config.get<CommonConfig>('common')!.auth.defaultName;

    const payload: IJWTUser = { userId, role, name, offsetUTC, lang };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken,
      sessionId,
    };
  }

  /**
   * @throws {Error}
   */
  private async generateRefreshToken(): Promise<IRefreshToken> {
    const refreshToken = randomUUID();
    const refreshTokenHash = await this.crypto.hash(refreshToken);

    const refreshTokenExpireAt = new Date();
    refreshTokenExpireAt.setDate(
      refreshTokenExpireAt.getDate() +
        this.config.get<CommonConfig>('common')!.jwt.refreshTokenExpiresIn,
    );

    return {
      refreshToken,
      refreshTokenHash,
      refreshTokenExpireAt,
    };
  }

  protected async checkMaxSessions(sessions: IUserSession[]): Promise<void> {
    if (sessions.length >= this.config.get<CommonConfig>('common')!.auth.maxSessions) {
      const oldSession = sessions.sort((a, b) => b.expireAt.getTime() - a.expireAt.getTime())[
        sessions.length - 1
      ];

      if (oldSession) {
        // LEGACY for FCM topics
        // if (oldSession.fcmToken) {
        //   await this.notifications.unsubscribeFromTopics(
        //     oldSession.fcmToken,
        //     Object.values(NotificationType),
        //   );
        // }
        await this.userSessions.destroy({ where: { id: oldSession.id } });
      }
    }
  }
}
