import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { I18nContext } from 'nestjs-i18n';
import { AdminConfig } from '../../../config/interfaces/admin';
import { CommonConfig } from '../../../config/interfaces/common';
import { UserProfileOrmService } from '../../../orm/modules/users/profiles/user-profile-orm.service';
import { UserSessionOrmService } from '../../../orm/modules/users/sessions/user-session-orm.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { ErrorDto, OkDto } from '../../../shared/dtos/responses.dto';
import { createError } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LoggerService } from '../../../shared/modules/logger/logger.service';
import { AuthBaseService } from '../../../shared/modules/auth/auth-base.service';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { CryptoHelperService } from '../../../shared/modules/crypto/crypto-helper.service';
import { UsersMapper } from '../users/users.mapper';
import { RefreshTokenReqDto, UserWithTokensDto } from './dtos/jwt.dto';
import { SignInReqDto } from './dtos/sign-in.dto';
import { SignOutReqDto } from './dtos/sign-out.dto';
import { IUser } from '../../../orm/modules/users/interfaces/user.interface';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { NotificationsService } from '../../../shared/modules/notifications/notifications.service';

@Injectable()
export class AuthService extends AuthBaseService {
  private configAdmin = this.config.get<AdminConfig>('admin')!;
  private configCommon = this.config.get<CommonConfig>('common')!;

  constructor(
    jwtService: JwtService,
    crypto: CryptoHelperService,
    config: ConfigService,
    users: UserOrmService,
    private userProfiles: UserProfileOrmService,
    userSessions: UserSessionOrmService,
    private usersMapper: UsersMapper,
    logs: LoggerService,
    private i18nHelper: I18nHelperService,
    notifications: NotificationsService,
  ) {
    super(jwtService, crypto, config, users, userSessions, logs, notifications);
    logClassName(this.constructor.name, __filename);
  }

  async signIn(
    i18n: I18nContext,
    { username, password, offsetUTC }: SignInReqDto,
  ): Promise<UserWithTokensDto> {
    try {
      const user = await this.users.getOneType({ where: { username } }, 'web', [
        'profile',
        'sessions',
      ]);
      if (!user || !user.passwordHash) {
        throw new Error(i18n.t(`errors.auth.noUser`));
      }

      const wrongPassword = !(await this.crypto.verify(password, user.passwordHash));
      if (wrongPassword) {
        throw new Error(i18n.t(`errors.auth.wrongPassword`));
      }

      const { sessions } = user;

      await this.checkMaxSessions(sessions);

      const tokens = await this.createTokens(user);

      const userUpdate: Partial<GetRequired<IUser>> = {};

      if (user.offsetUTC !== offsetUTC) {
        userUpdate.offsetUTC = offsetUTC;
      }

      if (user.lang !== i18n.lang) {
        userUpdate.lang = this.i18nHelper.getLang(i18n);
      }

      if (Object.keys(userUpdate).length) {
        await this.users.update(userUpdate, { where: { id: user.id } });
      }

      return {
        ...tokens,
        user: {
          ...this.usersMapper.toUserDto(i18n, user),
        },
      };
    } catch (e) {
      throw createError(i18n, 'auth', null, e.message);
    }
  }

  async signOut(
    i18n: I18nContext,
    dto: SignOutReqDto,
    user: IJWTUser,
    refreshToken?: string,
  ): Promise<OkDto> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw createError(i18n, 'auth', 'auth.noRefreshTokenInCookie');
    }

    await this.signOutBase({ ...dto, refreshToken }, user);
    return new OkDto();
  }

  async refreshTokens(
    i18n: I18nContext,
    dto: RefreshTokenReqDto,
    refreshToken?: string,
  ): Promise<UserWithTokensDto> {
    try {
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new Error(i18n.t(`errors.auth.noRefreshTokenInCookie`));
      }

      const [tokens, user] = await this.refreshTokensBase({ ...dto, refreshToken });

      const userUpdate: Partial<GetRequired<IUser>> = {};

      if (user.offsetUTC !== dto.offsetUTC) {
        userUpdate.offsetUTC = dto.offsetUTC;
      }

      if (user.lang !== i18n.lang) {
        userUpdate.lang = this.i18nHelper.getLang(i18n);
      }

      if (Object.keys(userUpdate).length) {
        await this.users.update(userUpdate, { where: { id: user.id } });
      }

      return {
        ...tokens,
        user: {
          ...this.usersMapper.toUserDto(i18n, user),
        },
      };
    } catch (e) {
      throw createError(i18n, 'auth', null, e.message);
    }
  }
}
