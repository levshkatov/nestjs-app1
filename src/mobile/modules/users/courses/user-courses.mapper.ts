import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  CourseScopesMap,
  ICourse,
} from '../../../../orm/modules/courses/interfaces/course.interface';
import {
  ICourseStepExercise,
  CourseStepExerciseScopesMap,
} from '../../../../orm/modules/courses/steps/exercises/interfaces/course-step-exercise.interface';
import {
  CourseStepScopesMap,
  ICourseStep,
} from '../../../../orm/modules/courses/steps/interfaces/course-step.interface';
import {
  IExerciseTask,
  ExerciseTaskScopesMap,
} from '../../../../orm/modules/exercises/tasks/interfaces/exercise-task.interface';
import { IMedia, MediaScopesMap } from '../../../../orm/modules/media/interfaces/media.interface';
import { IUserCourse } from '../../../../orm/modules/users/courses/interfaces/user-course.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { TasksMapper } from '../../tasks/tasks.mapper';
import {
  UserCourseExerciseFullDto,
  UserCourseExercisesDto,
} from './dtos/user-course-exercises.dto';
import { UserCourseStepsDto } from './dtos/user-course-steps.dto';
import {
  UserCourseDto,
  UserCourseStepDto,
  UserCourseStepExerciseDto,
  UserCourseStepExerciseTaskDto,
} from './dtos/user-course-structure.dto';
import { UserCourseSimpleDto } from './dtos/user-course.dto';
import { UserCourseStepState } from './interfaces/user-course-step-state.enum';

@Injectable()
export class UserCoursesMapper {
  constructor(
    private i18n: I18nHelperService,
    private tasksMapper: TasksMapper,
    private mediaMapper: MediaMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toUserCourseDto(
    i18nContext: I18nContext,
    { id, type, steps }: BS<ICourse, CourseScopesMap, 'steps'>,
    {
      courseStepId,
      courseStepExerciseId,
    }: RemoveNullReturnAll<IUserCourse, 'courseStepId' | 'courseStepExerciseId'>,
  ): UserCourseDto {
    const currentStep = steps.find(({ id }) => id === courseStepId);
    const currentStepIndex = currentStep ? currentStep.index : 1;

    const stepsDto = steps.map((step) =>
      this.toUserCourseStepDto(i18nContext, step, currentStepIndex, courseStepExerciseId),
    );

    return { id, type, currentStepIndex, steps: stepsDto };
  }

  toUserCourseSimpleDto(
    i18nContext: I18nContext,
    { id, type, i18n }: BS<ICourse, CourseScopesMap, 'i18n'>,
    photo: BS<IMedia, MediaScopesMap, 'photoSizes'> | null,
  ): UserCourseSimpleDto {
    const photoDto = photo ? this.mediaMapper.toPhotoDto(i18nContext, photo) : null;
    return {
      id,
      type,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: nullToUndefined(photoDto),
    };
  }

  toUserCourseStepDto(
    i18nContext: I18nContext,
    {
      index,
      i18n,
      courseStepExercises,
      photo,
    }: BS<
      ICourseStep,
      CourseStepScopesMap,
      'i18n' | 'photo' | 'courseStepExercises' | 'courseStepLetters'
    >,
    currentStepIndex: number,
    courseStepExerciseId: number,
  ): UserCourseStepDto {
    const state =
      index < currentStepIndex
        ? UserCourseStepState.completed
        : index === currentStepIndex
        ? UserCourseStepState.current
        : UserCourseStepState.oncoming;

    let currentExerciseIndex: number = 1;
    if (state === UserCourseStepState.current) {
      const currentExercise = courseStepExercises.find(
        ({ exerciseId }) => exerciseId === courseStepExerciseId,
      );
      currentExerciseIndex = currentExercise?.index || 1;
    }

    const exercisesDto = courseStepExercises.map((courseStepExercise) =>
      this.toUserCourseStepExerciseDto(
        i18nContext,
        courseStepExercise,
        state,
        currentExerciseIndex,
      ),
    );

    const exercisesCompleted = exercisesDto.reduce(
      (prev, { isCompleted }) => (isCompleted ? prev + 1 : prev),
      0,
    );
    const exercisesTotal = exercisesDto.length;
    const percent = exercisesTotal ? Math.round((exercisesCompleted / exercisesTotal) * 100) : 0;

    const photoDto = photo ? this.mediaMapper.toPhotoDto(i18nContext, photo) : null;

    return {
      index,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      state,
      exercisesCompleted,
      exercisesTotal: exercisesDto.length,
      percent,
      exercises: exercisesDto,
      photo: nullToUndefined(photoDto),
    };
  }

  toUserCourseStepExerciseDto(
    i18nContext: I18nContext,
    {
      exercise: { i18n, exerciseTasks },
      index,
    }: BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exercise'>,
    stepState: UserCourseStepState,
    currentTaskIndex: number,
  ): UserCourseStepExerciseDto {
    const isCompleted =
      stepState === UserCourseStepState.completed
        ? true
        : stepState === UserCourseStepState.oncoming
        ? false
        : index < currentTaskIndex
        ? true
        : false;

    const tasksDto = exerciseTasks.map((exerciseTask) =>
      this.toUserCourseStepExerciseTaskDto(i18nContext, exerciseTask, isCompleted),
    );

    return {
      index,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      isCompleted,
      tasks: tasksDto,
    };
  }

  toUserCourseStepExerciseTaskDto(
    i18nContext: I18nContext,
    { index, task: { name } }: BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>,
    isCompleted: boolean,
  ): UserCourseStepExerciseTaskDto {
    return { index, name, isCompleted };
  }

  toUserCourseExercisesDto(
    i18nContext: I18nContext,
    exercises: BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exercise'>[],
    courseStepExerciseId: number,
    currentExerciseIndex: number,
  ): UserCourseExercisesDto {
    return {
      currentExerciseId: courseStepExerciseId,
      exercises: exercises.map(({ index }) => ({
        index,
        state:
          index < currentExerciseIndex
            ? UserCourseStepState.completed
            : index === currentExerciseIndex
            ? UserCourseStepState.current
            : UserCourseStepState.oncoming,
      })),
    };
  }

  toUserCourseStepsDto(
    i18nContext: I18nContext,
    steps: ICourseStep[],
    currentStepId: number,
    photo?: BS<IMedia, MediaScopesMap, 'photoSizes'> | null,
  ): UserCourseStepsDto {
    const { index: currentStepIndex } = steps.find(({ id }) => id === currentStepId)!; // not null because already checked in service
    const photoDto = photo ? this.mediaMapper.toPhotoDto(i18nContext, photo) : undefined;
    return {
      steps: steps.map(({ index }) => ({
        index,
        state:
          index < currentStepIndex
            ? UserCourseStepState.completed
            : index === currentStepIndex
            ? UserCourseStepState.current
            : UserCourseStepState.oncoming,
      })),
      photo: photoDto,
    };
  }

  toUserCourseExerciseFullDto(
    i18nContext: I18nContext,
    {
      exercise: { id, i18n, exerciseTasks },
    }: BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exercise'>,
  ): UserCourseExerciseFullDto {
    const tasksDto = exerciseTasks.map((exerciseTask) =>
      this.tasksMapper.toTaskForCourseDto(i18nContext, exerciseTask),
    );

    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      goal: this.i18n.getValue(i18nContext, i18n, 'goal'),
      author: this.i18n.getValue(i18nContext, i18n, 'author'),
      source: this.i18n.getValue(i18nContext, i18n, 'source'),
      tasks: tasksDto,
    };
  }
}
