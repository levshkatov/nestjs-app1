import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingMeditation,
  InterestingMeditationScopesMap,
} from '../../../../orm/modules/interesting/meditations/interfaces/interesting-meditation.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { InterestingMapper } from '../interesting.mapper';
import {
  InterestingMeditationDetailedDto,
  InterestingMeditationGroupByCategoryDto,
} from './dtos/interesting-meditation.dto';

@Injectable()
export class InterestingMeditationsMapper extends InterestingMapper {
  constructor(i18n: I18nHelperService, mediaMapper: MediaMapper) {
    super(i18n, mediaMapper);
    logClassName(this.constructor.name, __filename);
  }

  toInterestingMeditationListDto(
    i18nContext: I18nContext,
    meditations: BS<
      IInterestingMeditation,
      InterestingMeditationScopesMap,
      'i18n' | 'photo' | 'category'
    >[],
  ): InterestingMeditationGroupByCategoryDto[] {
    return this.groupByCategory(i18nContext, meditations);
  }

  toInterestingMeditationDetailedDto(
    i18nContext: I18nContext,
    {
      id: interestingMeditationId,
      i18n,
      audioFemale,
      audioMale,
    }: BS<
      IInterestingMeditation,
      InterestingMeditationScopesMap,
      'i18n' | 'audioFemale' | 'audioMale'
    >,
  ): InterestingMeditationDetailedDto {
    return {
      interestingMeditationId,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      audioFemale: this.mediaMapper.toAudioDto(i18nContext, audioFemale),
      audioMale: this.mediaMapper.toAudioDto(i18nContext, audioMale),
    };
  }
}
