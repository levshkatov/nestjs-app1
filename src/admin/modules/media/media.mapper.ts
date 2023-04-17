import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IMedia } from '../../../orm/modules/media/interfaces/media.interface';
import { IUser, UserScopesMap } from '../../../orm/modules/users/interfaces/user.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { MediaBaseMapper } from '../../../shared/modules/media/media-base.mapper';
import { UsersMapper } from '../users/users.mapper';
import { MediaDto } from './dtos/media.dto';

@Injectable()
export class MediaMapper extends MediaBaseMapper {
  constructor(i18n: I18nHelperService, private usersMapper: UsersMapper) {
    super(i18n);
    logClassName(this.constructor.name, __filename);
  }

  toMediaDto(
    i18nContext: I18nContext,
    { id, tag, type, extension, src, createdAt, blurHash, photoSizes }: IMedia,
    user?: BS<IUser, UserScopesMap, 'profile'>,
  ): MediaDto {
    return {
      id,
      tag: nullToUndefined(tag),
      type,
      extension,
      src,
      createdAt,
      blurHash: nullToUndefined(blurHash),
      resized: this.toPhotoSizeDto(i18nContext, photoSizes) || {},
      author: user ? this.usersMapper.toUserDto(i18nContext, user) : undefined,
    };
  }
}
