import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingAudio,
  InterestingAudioScopesMap,
} from '../../../../orm/modules/interesting/audios/interfaces/interesting-audio.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import {
  InterestingAudioDetailedDto,
  InterestingAudioForListDto,
} from './dtos/interesting-audio.dto';

@Injectable()
export class InterestingAudiosMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingAudioForListDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IInterestingAudio, InterestingAudioScopesMap, 'i18n'>,
  ): InterestingAudioForListDto {
    return {
      id,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
    };
  }

  toInterestingAudioDetailedDto(
    i18nContext: I18nContext,
    { id: interestingAudioId, audio }: BS<IInterestingAudio, InterestingAudioScopesMap, 'audio'>,
  ): InterestingAudioDetailedDto {
    return {
      interestingAudioId,
      audio: this.mediaMapper.toAudioDto(i18nContext, audio),
    };
  }
}
