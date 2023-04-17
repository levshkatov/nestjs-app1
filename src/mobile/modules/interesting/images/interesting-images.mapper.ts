import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingImage,
  InterestingImageScopesMap,
} from '../../../../orm/modules/interesting/images/interfaces/interesting-image.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { InterestingImageForListDto } from './dtos/interesting-image.dto';

@Injectable()
export class InterestingImagesMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingImageForListDto(
    i18nContext: I18nContext,
    { id, photo }: BS<IInterestingImage, InterestingImageScopesMap, 'photo'>,
  ): InterestingImageForListDto {
    return {
      id,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
