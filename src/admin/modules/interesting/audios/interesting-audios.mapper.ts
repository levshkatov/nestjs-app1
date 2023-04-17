import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IInterestingAudioI18n } from '../../../../orm/modules/interesting/audios/interfaces/interesting-audio-i18n.interface';
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
  InterestingAudioI18nDto,
  InterestingAudioForListDto,
} from './dtos/interesting-audio.dto';

@Injectable()
export class InterestingAudiosMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingAudioForListDto(
    i18nContext: I18nContext,
    {
      id,
      i18n,
      audio,
      disabled,
    }: BS<IInterestingAudio, InterestingAudioScopesMap, 'i18n' | 'audio'>,
  ): InterestingAudioForListDto {
    return {
      id,
      disabled,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      audio: this.mediaMapper.toAudioDto(i18nContext, audio),
    };
  }

  toInterestingAudioDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      i18n,
      audio,
      disabled,
    }: BS<IInterestingAudio, InterestingAudioScopesMap, 'i18n' | 'audio'>,
    disclaimer?: string,
  ): InterestingAudioDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      audio: this.mediaMapper.toAudioDto(i18nContext, audio),
      translations: i18n.map((el) => this.toInterestingAudioI18nDto(i18nContext, el)),
    };
  }

  toInterestingAudioI18nDto(
    i18nContext: I18nContext,
    { lang, title }: IInterestingAudioI18n,
  ): InterestingAudioI18nDto {
    return {
      lang,
      title,
    };
  }
}
