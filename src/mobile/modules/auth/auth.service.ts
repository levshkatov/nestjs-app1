import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { OffsetUTC } from '../../../shared/interfaces/offset-utc.enum';
import { VerifyCodeNewPhoneReqDto, VerifyCodeReqDto } from './dtos/verify-code.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthBaseService } from '../../../shared/modules/auth/auth-base.service';
import { ConfigService } from '@nestjs/config';
import { PopUpService } from '../pop-up/pop-up.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { SignUpReqDto } from './dtos/sign-up.dto';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { Op } from 'sequelize';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { UserProfileOrmService } from '../../../orm/modules/users/profiles/user-profile-orm.service';
import { MobileConfig } from '../../../config/interfaces/mobile';
import { UserVerifyCodeOrmService } from '../../../orm/modules/users/verify-codes/user-verify-code-orm.service';
import { SignInReqDto } from './dtos/sign-in.dto';
import { RefreshTokenReqDto, UserWithTokensDto } from './dtos/jwt.dto';
import { UserSessionOrmService } from '../../../orm/modules/users/sessions/user-session-orm.service';
import { IUser, UserScopesMap } from '../../../orm/modules/users/interfaces/user.interface';
import { CommonConfig } from '../../../config/interfaces/common';
import { UsersMapper } from '../users/users.mapper';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { UserDto } from '../../shared/dtos/user.dto';
import { SignInAppleReqDto } from './socials/apple/dtos/sign-in-apple.dto';
import { AppleService } from './socials/apple/apple.service';
import { UserSocialOrmService } from '../../../orm/modules/users/socials/user-social-orm.service';
import { SocialType } from '../../../orm/modules/users/socials/interfaces/social-type.enum';
import { SignOutReqDto } from './dtos/sign-out.dto';
import { LoggerService } from '../../../shared/modules/logger/logger.service';
import { CryptoHelperService } from '../../../shared/modules/crypto/crypto-helper.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { NotificationsService } from '../../../shared/modules/notifications/notifications.service';

@Injectable()
export class AuthService extends AuthBaseService {
  private configMobile = this.config.get<MobileConfig>('mobile')!;
  private configCommon = this.config.get<CommonConfig>('common')!;

  constructor(
    private popup: PopUpService,
    jwtService: JwtService,
    crypto: CryptoHelperService,
    config: ConfigService,
    users: UserOrmService,
    private userProfiles: UserProfileOrmService,
    private userVerifyCodes: UserVerifyCodeOrmService,
    userSessions: UserSessionOrmService,
    private userSocials: UserSocialOrmService,
    private usersMapper: UsersMapper,
    private apple: AppleService,
    logs: LoggerService,
    private i18nHelper: I18nHelperService,
    notifications: NotificationsService,
  ) {
    super(jwtService, crypto, config, users, userSessions, logs, notifications);
    logClassName(this.constructor.name, __filename);
  }

  async signUp(i18n: I18nContext, { name, birthdate, email, phone }: SignUpReqDto): Promise<OkDto> {
    const existingUser = await this.users.getOneType(
      { where: { [Op.or]: { phone, email } } },
      'mobile',
    );

    if (existingUser?.phone === phone) {
      throw this.popup.error(i18n, `signUp.existingPhone`);
    }
    if (existingUser?.email === email) {
      throw this.popup.error(i18n, `signUp.existingEmail`);
    }

    const user = await this.users.create({
      role: UserRole.mobileUnsubscribed,
      phone,
      email,
      offsetUTC: OffsetUTC['+00:00'],
      lang: this.i18nHelper.getLang(i18n),
    });

    await this.userProfiles.create({
      userId: user.id,
      name,
      birthdate,
      waterBalance: 0,
      totalTasks: 0,
    });

    await this.createSmsCode(i18n, user.id);
    await this.sendSms();

    return new OkDto();
  }

  async signIn(i18n: I18nContext, { phone }: SignInReqDto): Promise<OkDto> {
    const user = await this.users.getOneType({ where: { phone } }, 'mobile');
    if (!user) {
      throw this.popup.error(i18n, `signIn.noUserWithPhone`);
    }

    await this.createSmsCode(i18n, user.id);
    await this.sendSms();

    return new OkDto();
  }

  async signInApple(
    i18n: I18nContext,
    { authCode, offsetUTC }: SignInAppleReqDto,
  ): Promise<UserWithTokensDto> {
    const { sub, email } = await this.apple.getToken(i18n, authCode);
    const userSocial = await this.userSocials.getOne({
      where: { id: sub, social: SocialType.apple },
    });

    if (userSocial) {
      const user = await this.users.getOneType(
        {
          where: { id: userSocial.userId },
        },
        'mobile',
        ['profile', 'verifyCode', 'sessions'],
      );
      if (!user) {
        throw this.popup.error(i18n, `signIn.commonError`);
      }

      await this.checkMaxSessions(user.sessions);

      return await this.createUserWithTokens(i18n, user, offsetUTC, true);
    } else {
      const user = await this.users.create({
        role: UserRole.mobileUnsubscribed,
        email: email || null,
        offsetUTC,
        lang: this.i18nHelper.getLang(i18n),
      });

      await this.userProfiles.create({
        userId: user.id,
        name: this.configCommon.auth.defaultName,
        waterBalance: 0,
        totalTasks: 0,
      });

      await this.userSocials.create({
        userId: user.id,
        social: SocialType.apple,
        id: sub,
      });

      const newUser = await this.users.getOneType({ where: { id: user.id } }, 'mobile', [
        'profile',
      ]);
      if (!newUser) {
        throw this.popup.error(i18n, `signIn.commonError`);
      }

      return await this.createUserWithTokens(i18n, newUser, offsetUTC, false);
    }
  }

  async signOut(
    i18n: I18nContext,
    { refreshToken, sessionId }: SignOutReqDto,
    user: IJWTUser,
  ): Promise<OkDto> {
    await this.signOutBase({ refreshToken, sessionId }, user);
    return new OkDto();
  }

  async verifyCode(
    i18n: I18nContext,
    { phone, code, offsetUTC }: VerifyCodeReqDto,
  ): Promise<UserWithTokensDto> {
    const user = await this.users.getOneType({ where: { phone } }, 'mobile', [
      'profile',
      'verifyCode',
      'sessions',
    ]);
    if (!user) {
      throw this.popup.error(i18n, `signIn.noUserWithPhone`);
    }
    const { id: userId, verifyCode, sessions } = user;

    if (!verifyCode || verifyCode.code !== code) {
      throw this.popup.error(i18n, `signIn.wrongCode`);
    }

    if (new Date() > new Date(verifyCode.expireAt)) {
      throw this.popup.error(i18n, `signIn.codeExpired`);
    }

    await this.userVerifyCodes.destroy({ where: { userId } });

    await this.checkMaxSessions(sessions);

    return await this.createUserWithTokens(i18n, user, offsetUTC);
  }

  async verifyCodeNewPhone(
    i18n: I18nContext,
    { userId, phone, code }: VerifyCodeNewPhoneReqDto,
  ): Promise<UserDto> {
    const user = await this.users.getOneType(
      {
        where: { id: userId, newPhone: phone },
      },
      'mobile',
      ['profile', 'verifyCode', 'sessions'],
    );
    if (!user) {
      throw this.popup.error(i18n, `signIn.noUserWithPhone`);
    }
    const { verifyCode } = user;

    if (!verifyCode || verifyCode.code !== code) {
      throw this.popup.error(i18n, `signIn.wrongCode`);
    }

    if (new Date() > new Date(verifyCode.expireAt)) {
      throw this.popup.error(i18n, `signIn.codeExpired`);
    }

    await this.userVerifyCodes.destroy({ where: { userId } });

    const [numOfUpdated] = await this.users.update(
      { newPhone: null, phone: user.newPhone },
      { where: { id: userId }, returning: true },
    );

    if (!numOfUpdated) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    return this.usersMapper.toUserDto(i18n, { ...user, phone });
  }

  async refreshTokens(i18n: I18nContext, dto: RefreshTokenReqDto): Promise<UserWithTokensDto> {
    try {
      const [tokens, user] = await this.refreshTokensBase(dto);

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
      throw this.popup.error(i18n, `signIn.refreshTokenError`, e.message ? [e.message] : []);
    }
  }

  private async createUserWithTokens(
    i18n: I18nContext,
    user: BS<IUser, UserScopesMap, 'profile'>,
    offsetUTC: OffsetUTC,
    firstAuth?: boolean,
  ): Promise<UserWithTokensDto> {
    try {
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
        firstAuth,
      };
    } catch (e) {
      throw this.popup.error(i18n, `signIn.refreshTokenError`, e.message ? [e.message] : []);
    }
  }

  async createSmsCode(i18n: I18nContext, userId: number) {
    const code =
      this.configMobile.auth.defaultSmsCode || Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + this.configMobile.auth.smsCodeLifetime);

    const oldCode = await this.userVerifyCodes.getOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    if (
      oldCode &&
      new Date().getTime() - oldCode.createdAt.getTime() <
        this.configMobile.auth.smsCodeFrequency * 1000
    ) {
      throw this.popup.error(i18n, `signIn.codeTooFrequent`);
    }

    await this.userVerifyCodes.destroy({ where: { userId } });
    await this.userVerifyCodes.create({ userId, code, expireAt });
  }

  async sendSms() {
    // TODO sms service
  }
}
