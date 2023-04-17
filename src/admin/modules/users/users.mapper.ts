import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { CommonConfig } from '../../../config/interfaces/common';
import { IUser, UserScopesMap } from '../../../orm/modules/users/interfaces/user.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { UserDto } from '../../shared/dtos/user.dto';
import { UserDetailedDto, UserForListDto } from './dtos/user.dto';

@Injectable()
export class UsersMapper {
  constructor(private i18n: I18nHelperService, private config: ConfigService) {
    logClassName(this.constructor.name, __filename);
  }

  toUserDto(
    i18nContext: I18nContext,
    { id, role, profile }: BS<IUser, UserScopesMap, 'profile'>,
  ): UserDto {
    return {
      id,
      name: profile.name || this.config.get<CommonConfig>('common')!.auth.defaultName,
      role,
    };
  }

  toUserForListDto(
    i18nContext: I18nContext,
    { id, role, phone, email, username, profile: { name } }: BS<IUser, UserScopesMap, 'profile'>,
  ): UserForListDto {
    return {
      id,
      role,
      name,
      phone: nullToUndefined(phone),
      email: nullToUndefined(email),
      username: nullToUndefined(username),
    };
  }

  toUserDetailedDto(
    i18nContext: I18nContext,
    { id, role, phone, email, username, profile: { name } }: BS<IUser, UserScopesMap, 'profile'>,
    disclaimer?: string,
  ): UserDetailedDto {
    return {
      disclaimer,
      id,
      role,
      name,
      phone: nullToUndefined(phone),
      email: nullToUndefined(email),
      username: nullToUndefined(username),
    };
  }
}
