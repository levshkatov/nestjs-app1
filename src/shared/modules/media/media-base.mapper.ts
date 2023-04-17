import { I18nContext } from 'nestjs-i18n';
import { IMediaPhotoSize } from '../../../orm/modules/media/interfaces/media-photo-size.interface';
import { IMedia, MediaScopesMap } from '../../../orm/modules/media/interfaces/media.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { PhotoSizeDto } from './dtos/photo-size.dto';
import { PhotoDto } from './dtos/photo.dto';
import { I18nHelperService } from '../i18n/i18n-helper.service';
import { AudioDto } from './dtos/audio.dto';

export class MediaBaseMapper {
  constructor(protected i18n: I18nHelperService) {}

  toPhotoDto(
    i18nContext: I18nContext,
    { id, src, blurHash, photoSizes }: BS<IMedia, MediaScopesMap, 'photoSizes'>,
  ): PhotoDto {
    return {
      id,
      src,
      blurHash: blurHash || '',
      resized: this.toPhotoSizeDto(i18nContext, photoSizes) || {},
    };
  }

  toPhotoSizeDto(
    i18nContext: I18nContext,
    photoSizes?: IMediaPhotoSize[],
  ): PhotoSizeDto | undefined {
    const resized: PhotoSizeDto = {};
    if (!photoSizes) {
      return undefined;
    }

    photoSizes.forEach(({ size, src }) => {
      if (!Object.keys(resized).includes(`src${size}`)) {
        resized[`src${size}` as keyof PhotoSizeDto] = src;
      }
    });

    return resized;
  }

  toAudioDto(i18nContext: I18nContext, { id, src }: IMedia): AudioDto {
    return {
      id,
      src,
    };
  }
}
