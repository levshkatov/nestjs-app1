import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ILevel, LevelScopesMap } from '../../../orm/modules/levels/interfaces/level.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../media/media.mapper';
import { LevelDto } from './dtos/level.dto';

@Injectable()
export class LevelsMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toLevelDto(
    i18nContext: I18nContext,
    { photo, i18n }: BS<ILevel, LevelScopesMap, 'i18n' | 'photo'>,
  ): LevelDto {
    return {
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
