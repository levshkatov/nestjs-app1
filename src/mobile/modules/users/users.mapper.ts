import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { CommonConfig } from '../../../config/interfaces/common';
import {
  CelebrityScopesMap,
  ICelebrity,
} from '../../../orm/modules/celebrities/interfaces/celebrity.interface';
import { IUser, UserScopesMap } from '../../../orm/modules/users/interfaces/user.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { UserDto } from '../../shared/dtos/user.dto';
import { MediaMapper } from '../media/media.mapper';
import { UserCelebrityDto } from './dtos/user-celebrity.dto';

@Injectable()
export class UsersMapper {
  constructor(
    private i18n: I18nHelperService,
    private config: ConfigService,
    private mediaMapper: MediaMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toUserDto(
    i18nContext: I18nContext,
    { id, phone, email, profile: { name, birthdate } }: BS<IUser, UserScopesMap, 'profile'>,
  ): UserDto {
    return {
      id,
      name: name || this.config.get<CommonConfig>('common')!.auth.defaultName,
      // phone: nullToUndefined(phone),
      email: nullToUndefined(email),
      birthdate: nullToUndefined(birthdate),
    };
  }

  toUserCelebrityDto(
    i18nContext: I18nContext,
    { id, i18n, photo }: BS<ICelebrity, CelebrityScopesMap, 'i18n' | 'photo'>,
  ): UserCelebrityDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
