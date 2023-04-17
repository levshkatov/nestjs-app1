import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  CourseStepExerciseScopesMap,
  ICourseStepExercise,
} from '../../../../../orm/modules/courses/steps/exercises/interfaces/course-step-exercise.interface';
import { BS } from '../../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../../../linked-objects.mapper';
import {
  CourseStepExerciseDetailedDto,
  CourseStepExerciseForListDto,
} from './dtos/course-step-exercise.dto';

@Injectable()
export class CourseStepExercisesMapper {
  constructor(private i18n: I18nHelperService, private linkedMapper: LinkedObjectsMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toCourseStepExerciseForListDto(
    i18nContext: I18nContext,
    { index, exercise }: BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exerciseNoTasks'>,
  ): CourseStepExerciseForListDto {
    return {
      index,
      exercise: this.linkedMapper.toExerciseLinkedDto(i18nContext, exercise, false),
    };
  }

  toCourseStepExerciseDetailedDto(
    i18nContext: I18nContext,
    {
      index,
      exercise,
      exerciseId,
    }: BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exerciseNoTasks'>,
    disclaimer?: string,
  ): CourseStepExerciseDetailedDto {
    return {
      disclaimer,
      exerciseId,
      index,
      exercise: this.linkedMapper.toExerciseLinkedDto(i18nContext, exercise, false),
    };
  }
}
