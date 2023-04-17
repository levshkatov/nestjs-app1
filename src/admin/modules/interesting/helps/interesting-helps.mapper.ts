import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IInterestingHelpI18n } from '../../../../orm/modules/interesting/helps/interfaces/interesting-help-i18n.interface';
import {
  IInterestingHelp,
  InterestingHelpScopesMap,
} from '../../../../orm/modules/interesting/helps/interfaces/interesting-help.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import {
  InterestingHelpDetailedDto,
  InterestingHelpI18nDto,
  InterestingHelpForListDto,
} from './dtos/interesting-help.dto';

@Injectable()
export class InterestingHelpsMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingHelpForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      audio,
      i18n,
      photo,
    }: BS<IInterestingHelp, InterestingHelpScopesMap, 'i18n' | 'photo' | 'audio'>,
  ): InterestingHelpForListDto {
    return {
      id,
      disabled,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      audio: this.mediaMapper.toAudioDto(i18nContext, audio),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }

  toInterestingHelpDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      audio,
      i18n,
      photo,
    }: BS<IInterestingHelp, InterestingHelpScopesMap, 'i18n' | 'photo' | 'audio'>,
    disclaimer?: string,
  ): InterestingHelpDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      audio: this.mediaMapper.toAudioDto(i18nContext, audio),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      translations: i18n.map((el) => this.toInterestingHelpI18nDto(i18nContext, el)),
    };
  }

  toInterestingHelpI18nDto(
    i18nContext: I18nContext,
    { lang, title, description }: IInterestingHelpI18n,
  ): InterestingHelpI18nDto {
    return {
      lang,
      title,
      description,
    };
  }
}
