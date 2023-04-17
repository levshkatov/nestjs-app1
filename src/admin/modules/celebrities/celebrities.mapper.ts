import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ICelebrityI18n } from '../../../orm/modules/celebrities/interfaces/celebrity-i18n.interface';
import {
  ICelebrity,
  CelebrityScopesMap,
} from '../../../orm/modules/celebrities/interfaces/celebrity.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../linked-objects.mapper';
import { MediaMapper } from '../media/media.mapper';
import { CelebrityDetailedDto, CelebrityForListDto, CelebrityI18nDto } from './dtos/celebrity.dto';

@Injectable()
export class CelebritiesMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private linkedMapper: LinkedObjectsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toCelebrityForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      i18n,
      photo,
      celebrityHabits,
      index,
      tag,
    }: BS<ICelebrity, CelebrityScopesMap, 'photo' | 'celebrityHabits' | 'i18n'>,
  ): CelebrityForListDto {
    return {
      id,
      disabled,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      habits: celebrityHabits.map(({ habit }) =>
        this.linkedMapper.toHabitLinkedDto(i18nContext, habit, false),
      ),
      index: nullToUndefined(index),
      tag: nullToUndefined(tag),
    };
  }

  toCelebrityDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      photo,
      celebrityHabits,
      i18n,
      index,
      tag,
    }: BS<ICelebrity, CelebrityScopesMap, 'i18n' | 'photo' | 'celebrityHabits'>,
    disclaimer?: string,
  ): CelebrityDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      habits: celebrityHabits.map(({ habit }) =>
        this.linkedMapper.toHabitLinkedDto(i18nContext, habit, false),
      ),
      translations: i18n.map((el) => this.toCelebrityI18nDto(i18nContext, el)),
      index: nullToUndefined(index),
      tag: nullToUndefined(tag),
    };
  }

  toCelebrityI18nDto(
    i18nContext: I18nContext,
    { lang, name, description, caption }: ICelebrityI18n,
  ): CelebrityI18nDto {
    return {
      lang,
      name,
      description,
      caption,
    };
  }
}
