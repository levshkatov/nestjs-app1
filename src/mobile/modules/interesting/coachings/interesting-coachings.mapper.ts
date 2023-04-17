import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingCoaching,
  InterestingCoachingScopesMap,
} from '../../../../orm/modules/interesting/coachings/interfaces/interesting-coaching.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { TasksMapper } from '../../tasks/tasks.mapper';
import { InterestingMapper } from '../interesting.mapper';
import {
  InterestingCoachingDetailedDto,
  InterestingCoachingForListDto,
  InterestingCoachingGroupByCategoryDto,
} from './dtos/interesting-coaching.dto';

@Injectable()
export class InterestingCoachingsMapper extends InterestingMapper {
  constructor(i18n: I18nHelperService, mediaMapper: MediaMapper, private tasksMapper: TasksMapper) {
    super(i18n, mediaMapper);
    logClassName(this.constructor.name, __filename);
  }

  // LEGACY
  toInterestingCoachingListDto(
    i18nContext: I18nContext,
    coachings: BS<
      IInterestingCoaching,
      InterestingCoachingScopesMap,
      'exercise' | 'photo' | 'category'
    >[],
  ): InterestingCoachingGroupByCategoryDto[] {
    return this.groupByCategory(
      i18nContext,
      coachings.map(({ id, categoryId, photo, exercise: { i18n }, category }) => {
        return {
          id,
          categoryId,
          photo,
          i18n: i18n.map(({ name, lang }) => ({ title: name, lang })),
          category,
        };
      }),
    );
  }

  toInterestingCoachingForListDto(
    i18nContext: I18nContext,
    {
      id,
      photo,
      exercise: { i18n },
    }: BS<IInterestingCoaching, InterestingCoachingScopesMap, 'exercise' | 'photo'>,
  ): InterestingCoachingForListDto {
    return {
      id,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      title: this.i18n.getValue(i18nContext, i18n, 'name'),
    };
  }

  toInterestingCoachingDetailedDto(
    i18nContext: I18nContext,
    {
      id: interestingCoachingId,
      exercise: { i18n, exerciseTasks },
    }: BS<IInterestingCoaching, InterestingCoachingScopesMap, 'exercise'>,
  ): InterestingCoachingDetailedDto {
    return {
      interestingCoachingId,
      title: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      goal: this.i18n.getValue(i18nContext, i18n, 'goal'),
      author: this.i18n.getValue(i18nContext, i18n, 'author'),
      source: this.i18n.getValue(i18nContext, i18n, 'source'),
      tasks: exerciseTasks.map((exerciseTask) =>
        this.tasksMapper.toTaskForCoachingDto(i18nContext, exerciseTask),
      ),
    };
  }
}
