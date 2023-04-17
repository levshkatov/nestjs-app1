import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingCoaching,
  InterestingCoachingScopesMap,
} from '../../../../orm/modules/interesting/coachings/interfaces/interesting-coaching.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../../linked-objects.mapper';
import { MediaMapper } from '../../media/media.mapper';
import {
  InterestingCoachingDetailedDto,
  InterestingCoachingForListDto,
} from './dtos/interesting-coaching.dto';

@Injectable()
export class InterestingCoachingsMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private linkedMapper: LinkedObjectsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingCoachingForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      category,
      exercise,
      photo,
    }: BS<
      IInterestingCoaching,
      InterestingCoachingScopesMap,
      'photo' | 'category' | 'exerciseSimple'
    >,
  ): InterestingCoachingForListDto {
    return {
      id,
      disabled,
      category: this.linkedMapper.toInterestingCategoryLinkedDto(i18nContext, category, false),
      exercise: this.linkedMapper.toExerciseLinkedDto(i18nContext, exercise, false),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }

  toInterestingCoachingDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      category,
      exercise,
      photo,
    }: BS<
      IInterestingCoaching,
      InterestingCoachingScopesMap,
      'photo' | 'category' | 'exerciseSimple'
    >,
    disclaimer?: string,
  ): InterestingCoachingDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      category: this.linkedMapper.toInterestingCategoryLinkedDto(i18nContext, category, false),
      exercise: this.linkedMapper.toExerciseLinkedDto(i18nContext, exercise, false),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
