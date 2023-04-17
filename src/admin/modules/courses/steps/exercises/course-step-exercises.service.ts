import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { OkDto } from '../../../../../shared/dtos/responses.dto';
import { logClassName } from '../../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../../shared/modules/i18n/i18n-helper.service';
import {
  CourseStepExercisesForListDto,
  CourseStepExerciseCreateReqDto,
  CourseStepExerciseDetailedDto,
  CourseStepExerciseEditReqDto,
} from './dtos/course-step-exercise.dto';
import { CourseStepExercisesMapper } from './course-step-exercises.mapper';
import { CourseStepExerciseOrmService } from '../../../../../orm/modules/courses/steps/exercises/course-step-exercise-orm.service';
import { CourseStepOrmService } from '../../../../../orm/modules/courses/steps/course-step-orm.service';
import { createError, ErrorTitle } from '../../../../../shared/helpers/create-error.helper';
import { BS } from '../../../../../orm/shared/interfaces/scopes.interface';
import {
  ICourseStep,
  CourseStepScopesMap,
} from '../../../../../orm/modules/courses/steps/interfaces/course-step.interface';
import { IndexObject, indexObjects } from '../../../../shared/helpers/index-objects.helper';
import { ExerciseOrmService } from '../../../../../orm/modules/exercises/exercise-orm.service';
import { UserCourseOrmService } from '../../../../../orm/modules/users/courses/user-course-orm.service';
import { courseStepOrders } from '../../../../../orm/modules/courses/steps/scopes/course-step.scopes';
import { createDisclaimer } from '../../../../../shared/helpers/create-disclaimer.helper';

@Injectable()
export class CourseStepExercisesService {
  constructor(
    private i18n: I18nHelperService,
    private stepExercises: CourseStepExerciseOrmService,
    private stepExercisesMapper: CourseStepExercisesMapper,
    private steps: CourseStepOrmService,
    private exercises: ExerciseOrmService,
    private userCourses: UserCourseOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    courseId: number,
    stepIndex: number,
  ): Promise<CourseStepExercisesForListDto> {
    const [{ courseStepExercises, id: courseStepId }] = await this.getStepExercises(
      i18n,
      'get',
      courseId,
      stepIndex,
    );

    const stepIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepId, isCompleted: false },
    }));

    return {
      courseStepExercises: courseStepExercises.map((stepExercise) =>
        this.stepExercisesMapper.toCourseStepExerciseForListDto(i18n, stepExercise),
      ),
      disclaimer: stepIsUsed
        ? createDisclaimer(
            i18n,
            'courseStepExercises.isUsed',
            'courseStepExercises.forbiddenIfUsed',
          )
        : undefined,
    };
  }

  async create(
    i18n: I18nContext,
    courseId: number,
    stepIndex: number,
    { index, exerciseId }: CourseStepExerciseCreateReqDto,
  ): Promise<OkDto> {
    const [{ id: courseStepId }, stepExercisesIO] = await this.getStepExercises(
      i18n,
      'create',
      courseId,
      stepIndex,
    );

    if (!(await this.exercises.getOne({ where: { id: exerciseId } }))) {
      throw createError(i18n, 'create', 'exercises.notFound');
    }

    if (stepExercisesIO.find(({ id }) => id === exerciseId)) {
      throw createError(i18n, 'create', 'courseStepExercises.noRepeatExercises');
    }

    const reindexed = indexObjects('create', { index, id: exerciseId }, stepExercisesIO);
    if (!reindexed) {
      throw createError(i18n, 'create', 'courseStepExercises.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toCreate.length !== 1 || !toCreate[0] || toDelete.length) {
      throw createError(i18n, 'create', 'courseStepExercises.wrongIndex');
    }
    await this.stepExercises.create({
      courseStepId,
      exerciseId: toCreate[0].id,
      index: toCreate[0].index,
    });

    if (toUpdate.length) {
      await this.stepExercises.bulkCreate(
        toUpdate.map(({ id, index }) => ({ exerciseId: id, courseStepId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    return new OkDto();
  }

  async getOne(
    i18n: I18nContext,
    courseId: number,
    stepIndex: number,
    index: number,
  ): Promise<CourseStepExerciseDetailedDto> {
    const [{ courseStepExercises, id: courseStepId }] = await this.getStepExercises(
      i18n,
      'get',
      courseId,
      stepIndex,
    );

    const stepExercise = courseStepExercises.find((exercise) => exercise.index === index);
    if (!stepExercise) {
      throw createError(i18n, 'get', 'courseStepExercises.notFound');
    }

    const stepIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepId, isCompleted: false },
    }));
    const exerciseIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepExerciseId: stepExercise.exerciseId, isCompleted: false },
    }));

    return this.stepExercisesMapper.toCourseStepExerciseDetailedDto(
      i18n,
      stepExercise,
      exerciseIsUsed
        ? createDisclaimer(i18n, 'courseStepExercises.editForbidden')
        : stepIsUsed
        ? createDisclaimer(
            i18n,
            'courseStepExercises.isUsed',
            'courseStepExercises.forbiddenIfUsed',
          )
        : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    courseId: number,
    stepIndex: number,
    index: number,
    { index: newIndex, exerciseId }: CourseStepExerciseEditReqDto,
  ): Promise<OkDto> {
    const [{ id: courseStepId }, stepExercisesIO] = await this.getStepExercises(
      i18n,
      'edit',
      courseId,
      stepIndex,
    );

    const stepExercise = stepExercisesIO.find((exercise) => exercise.index === index);
    if (!stepExercise) {
      throw createError(i18n, 'edit', 'courseStepExercises.notFound');
    }

    if (exerciseId === stepExercise.id && newIndex === index) {
      return new OkDto();
    }

    const exerciseIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepExerciseId: stepExercise.id, isCompleted: false },
    }));
    if (exerciseIsUsed) {
      throw createError(i18n, 'edit', 'courseStepExercises.exerciseIsUsed');
    }

    if (exerciseId !== stepExercise.id) {
      if (!(await this.exercises.getOne({ where: { id: exerciseId } }))) {
        throw createError(i18n, 'edit', 'exercises.notFound');
      }

      if (
        stepExercisesIO.find((exercise) => exercise.id === exerciseId && index !== exercise.index)
      ) {
        throw createError(i18n, 'edit', 'courseStepExercises.noRepeatExercises');
      }
    }

    const stepIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepId, isCompleted: false },
    }));
    if (stepIsUsed) {
      throw createError(i18n, 'edit', 'courseStepExercises.isUsed');
    }

    const reindexed = indexObjects(
      'edit',
      { index: newIndex, id: exerciseId },
      stepExercisesIO,
      index,
    );
    if (!reindexed) {
      throw createError(i18n, 'edit', 'courseStepExercises.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toCreate.length || toDelete.length) {
      throw createError(i18n, 'edit', 'courseStepExercises.wrongIndex');
    }

    if (toUpdate.length) {
      await this.stepExercises.bulkCreate(
        toUpdate.map(({ id, index }) => ({ exerciseId: id, courseStepId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    return new OkDto();
  }

  async delete(
    i18n: I18nContext,
    courseId: number,
    stepIndex: number,
    index: number,
  ): Promise<OkDto> {
    const [{ id: courseStepId }, stepExercisesIO] = await this.getStepExercises(
      i18n,
      'delete',
      courseId,
      stepIndex,
    );

    const stepExercise = stepExercisesIO.find((exercise) => exercise.index === index);
    if (!stepExercise) {
      throw createError(i18n, 'delete', 'courseStepExercises.notFound');
    }

    const stepIsUsed = !!(await this.userCourses.getOne({
      where: { courseStepId, isCompleted: false },
    }));
    if (stepIsUsed) {
      throw createError(i18n, 'edit', 'courseStepExercises.isUsed');
    }

    const reindexed = indexObjects('delete', stepExercise, stepExercisesIO);
    if (!reindexed) {
      throw createError(i18n, 'delete', 'courseStepExercises.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toDelete.length !== 1 || !toDelete[0] || toCreate.length) {
      throw createError(i18n, 'delete', 'courseStepExercises.wrongIndex');
    }
    await this.stepExercises.destroy({
      where: { courseStepId, exerciseId: toDelete[0].id },
    });

    if (toUpdate.length) {
      await this.stepExercises.bulkCreate(
        toUpdate.map(({ id, index }) => ({ exerciseId: id, courseStepId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    return new OkDto();
  }

  private async getStepExercises(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    courseId: number,
    index: number,
  ): Promise<[BS<ICourseStep, CourseStepScopesMap, 'courseStepExercisesNoTasks'>, IndexObject[]]> {
    const step = await this.steps.getOneFromAll(
      { where: { courseId, index }, order: [courseStepOrders.stepExercises] },
      ['courseStepExercisesNoTasks'],
    );
    if (!step) {
      throw createError(i18n, errorTitle, 'courseSteps.notFound');
    }
    return [
      step,
      step.courseStepExercises.map(({ exerciseId, index }) => ({ index, id: exerciseId })),
    ];
  }
}
