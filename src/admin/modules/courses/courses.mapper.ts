import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ICourseI18n } from '../../../orm/modules/courses/interfaces/course-i18n.interface';
import { ICourse, CourseScopesMap } from '../../../orm/modules/courses/interfaces/course.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../linked-objects.mapper';
import { MediaMapper } from '../media/media.mapper';
import { CourseDetailedDto, CourseI18nDto, CourseForListDto } from './dtos/course.dto';

@Injectable()
export class CoursesMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private linkedMapper: LinkedObjectsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toCourseForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      type,
      i18n,
      courseHabits,
      photo,
      index,
      tag,
    }: BS<ICourse, CourseScopesMap, 'photo' | 'courseHabits' | 'i18nSearch'>,
  ): CourseForListDto {
    return {
      id,
      disabled,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      type,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      habits: courseHabits.map(({ habit }) =>
        this.linkedMapper.toHabitLinkedDto(i18nContext, habit, false),
      ),
      index: nullToUndefined(index),
      tag: nullToUndefined(tag),
    };
  }

  toCourseDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      type,
      i18n,
      courseHabits,
      photo,
      photoInactive,
      index,
      tag,
    }: BS<ICourse, CourseScopesMap, 'photo' | 'courseHabits' | 'i18n' | 'photoInactive'>,
    disclaimer?: string,
  ): CourseDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      type,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      photoInactive: photoInactive
        ? this.mediaMapper.toPhotoDto(i18nContext, photoInactive)
        : undefined,
      habits: courseHabits.map(({ habit }) =>
        this.linkedMapper.toHabitLinkedDto(i18nContext, habit, false),
      ),
      translations: i18n.map((el) => this.toCourseI18nDto(i18nContext, el)),
      index: nullToUndefined(index),
      tag: nullToUndefined(tag),
    };
  }

  toCourseI18nDto(
    i18nContext: I18nContext,
    { lang, name, duration, description, extraDescription }: ICourseI18n,
  ): CourseI18nDto {
    return {
      lang,
      name,
      duration,
      description,
      extraDescription,
    };
  }
}
