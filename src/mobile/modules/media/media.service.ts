import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../pop-up/pop-up.service';
import { MediaDto, MediaReqDto } from './dtos/media.dto';
import { MediaMapper } from './media.mapper';
import { MediaOrmService } from '../../../orm/modules/media/media-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';

@Injectable()
export class MediaService {
  constructor(
    private popup: PopUpService,
    private media: MediaOrmService,
    private mediaMapper: MediaMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getOne(i18n: I18nContext, { id, tag }: MediaReqDto): Promise<MediaDto> {
    if (!id && !tag) {
      throw this.popup.error(i18n, `media.notFound`);
    }

    const media = await this.media.getOne({ where: id ? { id } : { tag } }, ['photoSizes']);
    if (!media) {
      throw this.popup.error(i18n, `media.notFound`);
    }

    return this.mediaMapper.toMediaDto(i18n, media);
  }
}
