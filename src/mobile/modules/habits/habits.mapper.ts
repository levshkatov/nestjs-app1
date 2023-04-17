import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { HabitScopesMap, IHabit } from '../../../orm/modules/habits/interfaces/habit.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../media/media.mapper';
import {
  HabitDetailedDto,
  HabitForCelebrityDto,
  HabitForCourseDto,
  HabitForListDto,
} from './dtos/habit.dto';

@Injectable()
export class HabitsMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toHabitForCelebrityDto(
    i18nContext: I18nContext,
    { id, i18n, category }: BS<IHabit, HabitScopesMap, 'category' | 'i18n'>,
  ): HabitForCelebrityDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, category.photo),
    };
  }

  toHabitForCourseDto(
    i18nContext: I18nContext,
    { id, i18n, category }: BS<IHabit, HabitScopesMap, 'category' | 'i18n'>,
  ): HabitForCourseDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, category.photo),
    };
  }

  toHabitForListDto(
    i18nContext: I18nContext,
    { id, daypart, i18n, category }: BS<IHabit, HabitScopesMap, 'i18n' | 'category'>,
    isAdded: boolean | undefined,
  ): HabitForListDto {
    return {
      id,
      daypart,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, category.photo),
      isAdded,
    };
  }

  toHabitDetailedDto(
    i18nContext: I18nContext,
    { id, daypart, i18n, category }: BS<IHabit, HabitScopesMap, 'i18n' | 'category'>,
    isAdded: boolean | undefined,
  ): HabitDetailedDto {
    return {
      id,
      daypart,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, category.photo),
      isAdded,
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      daypartDescription: this.i18n.getValue(i18nContext, i18n, 'daypartDescription'),
      goal: this.i18n.getValue(i18nContext, i18n, 'goal'),
      forWhom: this.i18n.getValue(i18nContext, i18n, 'forWhom'),
      categoryCaption: this.i18n.getValue(i18nContext, category.i18n, 'habitCaption'),
    };
  }
}
