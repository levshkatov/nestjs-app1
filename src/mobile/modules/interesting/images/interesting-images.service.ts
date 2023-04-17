import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { InterestingImagesMapper } from './interesting-images.mapper';
import { InterestingImageForListDto } from './dtos/interesting-image.dto';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { InterestingImageOrmService } from '../../../../orm/modules/interesting/images/interesting-image-orm.service';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class InterestingImagesService {
  constructor(
    private popup: PopUpService,
    private i18n: I18nHelperService,
    private images: InterestingImageOrmService,
    private imagesMapper: InterestingImagesMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<InterestingImageForListDto[]> {
    return (
      await this.images.getAll({ where: { disabled: false }, order: [['id', 'ASC']] }, [
        { method: 'photo' },
      ])
    ).map((image) => this.imagesMapper.toInterestingImageForListDto(i18n, image));
  }
}
