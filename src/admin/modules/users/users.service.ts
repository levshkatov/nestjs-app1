import { HttpException, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { IUser } from '../../../orm/modules/users/interfaces/user.interface';
import { IUserProfile } from '../../../orm/modules/users/profiles/interfaces/user-profile.interface';
import { UserProfileOrmService } from '../../../orm/modules/users/profiles/user-profile-orm.service';
import { UserSessionOrmService } from '../../../orm/modules/users/sessions/user-session-orm.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { ErrorDto, OkDto } from '../../../shared/dtos/responses.dto';
import { createError } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { OffsetUTC } from '../../../shared/interfaces/offset-utc.enum';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { CryptoHelperService } from '../../../shared/modules/crypto/crypto-helper.service';
import {
  UserDetailedDto,
  UsersForListDto,
  UserProfileReqDto,
  UsersReqDto,
  UserCreateReqDto,
  UserEditReqDto,
} from './dtos/user.dto';
import { UsersMapper } from './users.mapper';

@Injectable()
export class UsersService {
  constructor(
    private users: UserOrmService,
    private userProfiles: UserProfileOrmService,
    private usersMapper: UsersMapper,
    private crypto: CryptoHelperService,
    private userSessions: UserSessionOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: UsersReqDto,
  ): Promise<UsersForListDto> {
    const { pages, total, users } = await this.users.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      users: users.map((user) => this.usersMapper.toUserForListDto(i18n, user)),
    };
  }

  async create(
    i18n: I18nContext,
    { role, username, password, name }: UserCreateReqDto,
  ): Promise<OkDto> {
    try {
      if (await this.users.getOne({ where: { username } })) {
        throw new Error(i18n.t(`errors.users.isExisting`));
      }

      const passwordHash = await this.crypto.hash(password);

      const user = await this.users.create({
        role,
        username,
        passwordHash,
        offsetUTC: OffsetUTC['+00:00'],
        lang: Lang.ru,
      });

      await this.userProfiles.create({
        userId: user.id,
        name,
        waterBalance: 0,
        totalTasks: 0,
      });

      return new OkDto();
    } catch (e) {
      throw createError(i18n, 'create', null, e.message);
    }
  }

  async edit(
    i18n: I18nContext,
    { username, name, newPassword, oldPassword }: UserEditReqDto,
    { userId }: IJWTUser,
  ): Promise<{ response: OkDto; clearCookie: boolean }> {
    const user = await this.users.getOne({ where: { id: userId } }, ['profile']);
    if (!user) {
      throw createError(i18n, 'get', 'users.notFound');
    }

    const userUpdate: Partial<GetRequired<IUser>> = {};
    const profileUpdate: Partial<GetRequired<IUserProfile>> = {};

    if (username !== user.username) {
      userUpdate.username = username;
    }

    if (name !== user.profile.name) {
      profileUpdate.name = name;
    }

    if (newPassword) {
      if (!oldPassword) {
        throw createError(i18n, 'edit', 'users.noOldPassword');
      }

      if (oldPassword === newPassword) {
        throw createError(i18n, 'edit', 'users.equalPasswords');
      }

      try {
        if (user.passwordHash) {
          if (!(await this.crypto.verify(oldPassword, user.passwordHash))) {
            throw new Error(i18n.t(`errors.users.wrongOldPassword`));
          }
        }

        const passwordHash = await this.crypto.hash(newPassword);
        userUpdate.passwordHash = passwordHash;
      } catch (e) {
        throw createError(i18n, 'edit', null, e.message);
      }
    }

    if (Object.keys(userUpdate).length) {
      await this.users.update(userUpdate, { where: { id: userId } });
    }
    if (Object.keys(profileUpdate).length) {
      await this.userProfiles.update(profileUpdate, { where: { userId } });
    }

    let clearCookie = false;
    if (userUpdate.passwordHash) {
      await this.userSessions.destroy({ where: { userId } });
      clearCookie = true;
    }

    return { response: new OkDto(), clearCookie };
  }

  async getOne(
    i18n: I18nContext,
    { id }: UserProfileReqDto,
    { userId, role }: IJWTUser,
  ): Promise<UserDetailedDto> {
    if (!id || id === userId) {
      const user = await this.users.getOne({ where: { id: userId } }, ['profile']);
      if (!user) {
        throw createError(i18n, 'get', 'users.notFound');
      }
      return this.usersMapper.toUserDetailedDto(i18n, user);
    }

    if (role !== UserRole.webAdmin) {
      throw new HttpException({}, 403);
    }

    const user = await this.users.getOne({ where: { id } }, ['profile']);
    if (!user) {
      throw createError(i18n, 'get', 'users.notFound');
    }

    return this.usersMapper.toUserDetailedDto(i18n, user);
  }
}
