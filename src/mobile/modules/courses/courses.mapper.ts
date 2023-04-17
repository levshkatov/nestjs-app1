import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ICourse, CourseScopesMap } from '../../../orm/modules/courses/interfaces/course.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { HabitsMapper } from '../habits/habits.mapper';
import { MediaMapper } from '../media/media.mapper';
import { CourseDetailedDto, CourseForListDto } from './dtos/course.dto';

@Injectable()
export class CoursesMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private habitsMapper: HabitsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toCourseForListDto(
    i18nContext: I18nContext,
    {
      id,
      type,
      disabled,
      i18n,
      photo,
      photoInactive,
    }: BS<ICourse, CourseScopesMap, 'photo' | 'photoInactive' | 'i18n'>,
    { isAdded, isCompleted }: { isAdded: boolean | undefined; isCompleted: boolean | undefined },
  ): CourseForListDto {
    return {
      id,
      type,
      disabled,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      photoInactive: photoInactive
        ? this.mediaMapper.toPhotoDto(i18nContext, photoInactive)
        : undefined,
      isAdded,
      isCompleted,
    };
  }

  toCourseDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      type,
      disabled,
      i18n,
      photo,
      courseHabits,
    }: BS<ICourse, CourseScopesMap, 'photo' | 'i18n' | 'courseHabits'>,
    { isAdded, isCompleted }: { isAdded: boolean | undefined; isCompleted: boolean | undefined },
  ): CourseDetailedDto {
    return {
      id,
      type,
      disabled,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      photoInactive: undefined,
      isAdded,
      isCompleted,
      duration: this.i18n.getValue(i18nContext, i18n, 'duration'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      extraDescription: this.i18n.getValue(i18nContext, i18n, 'extraDescription', []),
      habits: courseHabits.map(({ habit }) =>
        this.habitsMapper.toHabitForCourseDto(i18nContext, habit),
      ),
    };
  }
}
