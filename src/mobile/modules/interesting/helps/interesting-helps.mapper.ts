import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingHelp,
  InterestingHelpScopesMap,
} from '../../../../orm/modules/interesting/helps/interfaces/interesting-help.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { InterestingHelpDetailedDto, InterestingHelpForListDto } from './dtos/interesting-help.dto';

@Injectable()
export class InterestingHelpsMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingHelpForListDto(
    i18nContext: I18nContext,
    { id, i18n, photo }: BS<IInterestingHelp, InterestingHelpScopesMap, 'i18n' | 'photo'>,
  ): InterestingHelpForListDto {
    return {
      id,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }

  toInterestingHelpDetailedDto(
    i18nContext: I18nContext,
    {
      id: interestingHelpId,
      i18n,
      audio,
    }: BS<IInterestingHelp, InterestingHelpScopesMap, 'i18n' | 'audio'>,
  ): InterestingHelpDetailedDto {
    return {
      interestingHelpId,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      audio: this.mediaMapper.toAudioDto(i18nContext, audio),
    };
  }
}
