import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IInterestingMeditationI18n } from '../../../../orm/modules/interesting/meditations/interfaces/interesting-meditation-i18n.interface';
import {
  IInterestingMeditation,
  InterestingMeditationScopesMap,
} from '../../../../orm/modules/interesting/meditations/interfaces/interesting-meditation.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../../linked-objects.mapper';
import { MediaMapper } from '../../media/media.mapper';
import {
  InterestingMeditationDetailedDto,
  InterestingMeditationI18nDto,
  InterestingMeditationForListDto,
} from './dtos/interesting-meditation.dto';

@Injectable()
export class InterestingMeditationsMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private linkedMapper: LinkedObjectsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingMeditationForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      audioFemale,
      audioMale,
      category,
      i18n,
      photo,
    }: BS<
      IInterestingMeditation,
      InterestingMeditationScopesMap,
      'i18n' | 'photo' | 'category' | 'audioFemale' | 'audioMale'
    >,
  ): InterestingMeditationForListDto {
    return {
      id,
      disabled,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      category: this.linkedMapper.toInterestingCategoryLinkedDto(i18nContext, category, false),
      audioMale: this.mediaMapper.toAudioDto(i18nContext, audioMale),
      audioFemale: this.mediaMapper.toAudioDto(i18nContext, audioFemale),
    };
  }

  toInterestingMeditationDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      audioFemale,
      audioMale,
      category,
      i18n,
      photo,
    }: BS<
      IInterestingMeditation,
      InterestingMeditationScopesMap,
      'i18n' | 'photo' | 'category' | 'audioFemale' | 'audioMale'
    >,
    disclaimer?: string,
  ): InterestingMeditationDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      category: this.linkedMapper.toInterestingCategoryLinkedDto(i18nContext, category, false),
      audioMale: this.mediaMapper.toAudioDto(i18nContext, audioMale),
      audioFemale: this.mediaMapper.toAudioDto(i18nContext, audioFemale),
      translations: i18n.map((el) => this.toInterestingMeditationI18nDto(i18nContext, el)),
    };
  }

  toInterestingMeditationI18nDto(
    i18nContext: I18nContext,
    { lang, title, description }: IInterestingMeditationI18n,
  ): InterestingMeditationI18nDto {
    return { lang, title, description };
  }
}
