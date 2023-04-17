import { Injectable } from '@nestjs/common';
import { IMedia, MediaScopesMap } from '../../../orm/modules/media/interfaces/media.interface';
import { MediaDto } from './dtos/media.dto';
import { nullToUndefined } from '../../../shared/helpers/null-to-undefined.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { MediaBaseMapper } from '../../../shared/modules/media/media-base.mapper';
import { I18nContext } from 'nestjs-i18n';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';

@Injectable()
export class MediaMapper extends MediaBaseMapper {
  constructor(i18n: I18nHelperService) {
    super(i18n);
    logClassName(this.constructor.name, __filename);
  }

  toMediaDto(
    i18nContext: I18nContext,
    {
      id,
      tag,
      type,
      extension,
      src,
      blurHash,
      createdAt,
      photoSizes,
    }: BS<IMedia, MediaScopesMap, 'photoSizes'>,
  ): MediaDto {
    return {
      id,
      tag: nullToUndefined(tag),
      type,
      extension,
      src,
      blurHash: nullToUndefined(blurHash),
      createdAt,
      resized: this.toPhotoSizeDto(i18nContext, photoSizes),
    };
  }
}
