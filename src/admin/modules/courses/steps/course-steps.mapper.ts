import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ICourseStepI18n } from '../../../../orm/modules/courses/steps/interfaces/course-step-i18n.interface';
import {
  ICourseStep,
  CourseStepScopesMap,
} from '../../../../orm/modules/courses/steps/interfaces/course-step.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../../linked-objects.mapper';
import { MediaMapper } from '../../media/media.mapper';
import {
  CourseStepDetailedDto,
  CourseStepI18nDto,
  CourseStepForListDto,
} from './dtos/course-step.dto';

@Injectable()
export class CourseStepsMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private linkedMapper: LinkedObjectsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toCourseStepForListDto(
    i18nContext: I18nContext,
    {
      index,
      photo,
      i18n,
      courseStepLetters,
      courseStepExercises,
    }: BS<
      ICourseStep,
      CourseStepScopesMap,
      'i18n' | 'photo' | 'courseStepLetters' | 'courseStepExercises'
    >,
  ): CourseStepForListDto {
    return {
      index,
      photo: photo ? this.mediaMapper.toPhotoDto(i18nContext, photo) : undefined,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      letters: courseStepLetters.map(({ letter }) =>
        this.linkedMapper.toLetterLinkedDto(i18nContext, letter, false),
      ),
      exercises: courseStepExercises.map(({ exercise }) =>
        this.linkedMapper.toExerciseLinkedDto(i18nContext, exercise, false),
      ),
    };
  }

  toCourseStepDetailedDto(
    i18nContext: I18nContext,
    {
      index,
      photo,
      courseStepExercises,
      courseStepLetters,
      i18n,
    }: BS<
      ICourseStep,
      CourseStepScopesMap,
      'i18n' | 'photo' | 'courseStepLetters' | 'courseStepExercises'
    >,
    disclaimer?: string,
  ): CourseStepDetailedDto {
    return {
      disclaimer,
      index,
      photo: photo ? this.mediaMapper.toPhotoDto(i18nContext, photo) : undefined,
      letters: courseStepLetters.map(({ letter }) =>
        this.linkedMapper.toLetterLinkedDto(i18nContext, letter, false),
      ),
      exercises: courseStepExercises.map(({ exercise }) =>
        this.linkedMapper.toExerciseLinkedDto(i18nContext, exercise, false),
      ),
      translations: i18n.map((el) => this.toCourseStepI18nDto(i18nContext, el)),
    };
  }

  toCourseStepI18nDto(
    i18nContext: I18nContext,
    { lang, name, description }: ICourseStepI18n,
  ): CourseStepI18nDto {
    return {
      lang,
      name,
      description,
    };
  }
}
