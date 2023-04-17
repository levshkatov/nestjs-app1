import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ITree, TreeScopesMap } from '../../../orm/modules/trees/interfaces/tree.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../media/media.mapper';
import { TreeDto } from './dtos/tree.dto';

@Injectable()
export class TreesMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toTreeDto(
    i18nContext: I18nContext,
    { index, photo, i18n }: BS<ITree, TreeScopesMap, 'i18n' | 'photo'>,
  ): TreeDto {
    return {
      index,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
