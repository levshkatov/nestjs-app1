import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IExerciseI18n } from '../../../orm/modules/exercises/interfaces/exercise-i18n.interface';
import {
  IExercise,
  ExerciseScopesMap,
} from '../../../orm/modules/exercises/interfaces/exercise.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { ObjectLinkedDto } from '../../shared/dtos/object-linked.dto';
import { LinkedObjectsMapper } from '../linked-objects.mapper';
import { ExerciseDetailedDto, ExerciseForListDto, ExerciseI18nDto } from './dtos/exercise.dto';

@Injectable()
export class ExercisesMapper {
  constructor(private i18n: I18nHelperService, private linkedMapper: LinkedObjectsMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toExerciseForListDto(
    i18nContext: I18nContext,
    {
      id,
      i18n,
      exerciseTasks,
      courseStepExercises,
      interestingCoachings,
    }: BS<
      IExercise,
      ExerciseScopesMap,
      'i18nSearch' | 'exerciseTasksSearch' | 'courseStepExercises' | 'interestingCoachings'
    >,
  ): ExerciseForListDto {
    const linked: ObjectLinkedDto[] = [];
    linked.push(
      ...courseStepExercises.map(({ courseStep }) =>
        this.linkedMapper.toCourseStepLinkedDto(i18nContext, courseStep, true),
      ),
    );
    linked.push(
      ...interestingCoachings.map((el) =>
        this.linkedMapper.toCoachingLinkedDto(i18nContext, el, true),
      ),
    );

    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      tasks: exerciseTasks.map((exerciseTask) =>
        this.linkedMapper.toExerciseTaskLinkedDto(i18nContext, exerciseTask, false),
      ),
      linked,
    };
  }

  toExerciseDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      i18n,
      exerciseTasks,
      courseStepExercises,
      interestingCoachings,
    }: BS<
      IExercise,
      ExerciseScopesMap,
      'courseStepExercises' | 'interestingCoachings' | 'i18n' | 'exerciseTasks'
    >,
    disclaimer?: string,
  ): ExerciseDetailedDto {
    const linked: ObjectLinkedDto[] = [];
    linked.push(
      ...courseStepExercises.map(({ courseStep }) =>
        this.linkedMapper.toCourseStepLinkedDto(i18nContext, courseStep, true),
      ),
    );
    linked.push(
      ...interestingCoachings.map((el) =>
        this.linkedMapper.toCoachingLinkedDto(i18nContext, el, true),
      ),
    );

    return {
      disclaimer,
      id,
      tasks: exerciseTasks.map((exerciseTask) =>
        this.linkedMapper.toExerciseTaskLinkedDto(i18nContext, exerciseTask, false),
      ),
      linked,
      translations: i18n.map((el) => this.toExerciseI18nDto(i18nContext, el)),
    };
  }

  toExerciseI18nDto(
    i18nContext: I18nContext,
    { lang, author, description, goal, name, source }: IExerciseI18n,
  ): ExerciseI18nDto {
    return {
      lang,
      author,
      description,
      goal,
      name,
      source,
    };
  }
}
