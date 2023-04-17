import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import {
  CourseStepsForListDto,
  CourseStepCreateReqDto,
  CourseStepDetailedDto,
  CourseStepEditReqDto,
} from './dtos/course-step.dto';
import { CourseStepsMapper } from './course-steps.mapper';
import { CourseStepOrmService } from '../../../../orm/modules/courses/steps/course-step-orm.service';
import { createError, ErrorTitle } from '../../../../shared/helpers/create-error.helper';
import { UserCourseOrmService } from '../../../../orm/modules/users/courses/user-course-orm.service';
import { IndexObject, indexObjects } from '../../../shared/helpers/index-objects.helper';
import { CourseOrmService } from '../../../../orm/modules/courses/course-orm.service';
import {
  ICourse,
  CourseScopesMap,
} from '../../../../orm/modules/courses/interfaces/course.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { CourseType } from '../../../../orm/modules/courses/interfaces/course-type.enum';
import { MediaOrmService } from '../../../../orm/modules/media/media-orm.service';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import { ICourseStep } from '../../../../orm/modules/courses/steps/interfaces/course-step.interface';
import { LetterOrmService } from '../../../../orm/modules/letters/letter-orm.service';
import { Op } from 'sequelize';
import { LetterTrigger } from '../../../../orm/modules/letters/interfaces/letter-trigger.enum';
import { areArraysEqual } from '../../../../shared/helpers/are-arrays-equal.helper';
import { createDisclaimer } from '../../../../shared/helpers/create-disclaimer.helper';

@Injectable()
export class CourseStepsService {
  constructor(
    private i18n: I18nHelperService,
    private courseSteps: CourseStepOrmService,
    private courseStepsMapper: CourseStepsMapper,
    private userCourses: UserCourseOrmService,
    private courses: CourseOrmService,
    private media: MediaOrmService,
    private letters: LetterOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext, courseId: number): Promise<CourseStepsForListDto> {
    const courseSteps = await this.courseSteps.getAll(
      {
        where: { courseId },
        order: [['index', 'ASC']],
      },
      ['i18n', 'photo', 'courseStepExercises', 'courseStepLetters'],
    );

    const courseIsUsed = !!(await this.userCourses.getOne({
      where: { courseId, isCompleted: false },
    }));

    return {
      courseSteps: courseSteps.map((courseStep) =>
        this.courseStepsMapper.toCourseStepForListDto(i18n, courseStep),
      ),
      disclaimer: courseIsUsed
        ? createDisclaimer(i18n, 'courseSteps.isUsed', 'courseSteps.forbiddenIfUsed')
        : undefined,
    };
  }

  async create(
    i18n: I18nContext,
    courseId: number,
    { index, photoId, translations, lettersIds }: CourseStepCreateReqDto,
  ): Promise<OkDto> {
    const [{ type }, courseSteps] = await this.getCourseSteps(i18n, 'create', courseId);

    this.i18n.checkFallbackLang(i18n, translations);

    await this.checkPhoto(i18n, 'create', type, photoId);

    if (lettersIds.length) {
      if (new Set(lettersIds).size !== lettersIds.length) {
        throw createError(i18n, 'create', 'courseSteps.wrongLetters');
      }

      const letters = await this.letters.getAll({
        where: {
          id: { [Op.in]: lettersIds },
          trigger: { [Op.in]: [LetterTrigger.stepStart, LetterTrigger.stepFinish] },
        },
      });
      if (!letters.length || letters.length !== lettersIds.length) {
        throw createError(i18n, 'create', 'courseSteps.wrongLetters');
      }
    }

    const reindexed = indexObjects('create', { index, id: 0 }, courseSteps);
    if (!reindexed) {
      throw createError(i18n, 'create', 'courseSteps.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toCreate.length !== 1 || !toCreate[0] || toDelete.length) {
      throw createError(i18n, 'create', 'courseSteps.wrongIndex');
    }

    const courseStep = await this.courseSteps.create({
      index: toCreate[0].index,
      courseId,
      photoId,
    });
    if (toUpdate.length) {
      await this.courseSteps.bulkCreate(
        toUpdate.map(({ id, index }) => ({ id, courseId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    await this.courseSteps.createI18n(
      this.i18n.createTranslations(translations, { courseStepId: courseStep.id }),
    );

    await this.courseSteps.createLetters(
      lettersIds.map((letterId) => ({ courseStepId: courseStep.id, letterId })),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, courseId: number, index: number): Promise<CourseStepDetailedDto> {
    const courseStep = await this.courseSteps.getOneFromAll({ where: { courseId, index } }, [
      'i18n',
      'photo',
      'courseStepExercises',
      'courseStepLetters',
    ]);
    if (!courseStep) {
      throw createError(i18n, 'get', 'courseSteps.notFound');
    }

    const courseIsUsed = !!(await this.userCourses.getOne({
      where: { courseId: courseStep.courseId, isCompleted: false },
    }));

    return this.courseStepsMapper.toCourseStepDetailedDto(
      i18n,
      courseStep,
      courseIsUsed
        ? createDisclaimer(i18n, 'courseSteps.isUsed', 'courseSteps.forbiddenIfUsed')
        : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    courseId: number,
    index: number,
    { index: newIndex, translations, photoId, lettersIds }: CourseStepEditReqDto,
  ): Promise<OkDto> {
    const [{ type }, courseSteps] = await this.getCourseSteps(i18n, 'edit', courseId);

    const courseStep = await this.courseSteps.getOneFromAll({ where: { courseId, index } }, [
      'courseStepLetters',
    ]);
    if (!courseStep) {
      throw createError(i18n, 'edit', 'courseSteps.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const courseIsUsed = !!(await this.userCourses.getOne({
      where: { courseId, isCompleted: false },
    }));

    const courseStepUpdate: Partial<GetRequired<ICourseStep>> = {};

    if (photoId && courseStep.photoId !== photoId) {
      await this.checkPhoto(i18n, 'edit', type, photoId);
      courseStepUpdate.photoId = photoId;
    }

    if (newIndex !== index) {
      if (courseIsUsed) {
        throw createError(i18n, 'edit', 'courseSteps.isUsed');
      }

      const reindexed = indexObjects(
        'edit',
        { index: newIndex, id: courseStep.id },
        courseSteps,
        index,
      );
      if (!reindexed) {
        throw createError(i18n, 'edit', 'courseSteps.wrongIndex');
      }

      const { toCreate, toUpdate, toDelete } = reindexed;

      if (toCreate.length || toDelete.length) {
        throw createError(i18n, 'edit', 'courseSteps.wrongIndex');
      }

      if (toUpdate.length) {
        await this.courseSteps.bulkCreate(
          toUpdate.map(({ id, index }) => ({ id, courseId, index })),
          { updateOnDuplicate: ['index'] },
        );
      }
    }

    if (Object.keys(courseStepUpdate).length) {
      await this.courseSteps.update(courseStepUpdate, { where: { id: courseStep.id } });
    }

    await this.courseSteps.destroyI18n({ where: { courseStepId: courseStep.id } });
    await this.courseSteps.createI18n(
      this.i18n.createTranslations(translations, { courseStepId: courseStep.id }),
    );

    if (
      !areArraysEqual(
        lettersIds,
        courseStep.courseStepLetters.map(({ letterId }) => letterId),
      )
    ) {
      await this.courseSteps.destroyLetters({ where: { courseStepId: courseStep.id } });
      await this.courseSteps.createLetters(
        lettersIds.map((letterId) => ({ courseStepId: courseStep.id, letterId })),
      );
    }

    return new OkDto();
  }

  async delete(i18n: I18nContext, courseId: number, index: number): Promise<OkDto> {
    const courseIsUsed = !!(await this.userCourses.getOne({
      where: { courseId, isCompleted: false },
    }));
    if (courseIsUsed) {
      throw createError(i18n, 'edit', 'courseSteps.isUsed');
    }

    const [{}, courseStepsIO] = await this.getCourseSteps(i18n, 'delete', courseId);

    const courseStepIO = courseStepsIO.find((step) => step.index === index);
    if (!courseStepIO) {
      throw createError(i18n, 'delete', 'courseSteps.notFound');
    }

    const reindexed = indexObjects('delete', courseStepIO, courseStepsIO);
    if (!reindexed) {
      throw createError(i18n, 'delete', 'courseSteps.wrongIndex');
    }

    const { toCreate, toUpdate, toDelete } = reindexed;

    if (toDelete.length !== 1 || !toDelete[0] || toCreate.length) {
      throw createError(i18n, 'delete', 'courseSteps.wrongIndex');
    }
    await this.courseSteps.destroy({
      where: { id: toDelete[0].id },
    });

    if (toUpdate.length) {
      await this.courseSteps.bulkCreate(
        toUpdate.map(({ id, index }) => ({ id, courseId, index })),
        { updateOnDuplicate: ['index'] },
      );
    }

    return new OkDto();
  }

  private async getCourseSteps(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    courseId: number,
  ): Promise<[BS<ICourse, CourseScopesMap, 'stepsSimple'>, IndexObject[]]> {
    const course = await this.courses.getOneFromAll({ where: { id: courseId } }, ['stepsSimple']);
    if (!course) {
      throw createError(i18n, errorTitle, 'courses.notFound');
    }

    return [course, course.steps.map(({ index, id }) => ({ index, id }))];
  }

  private async checkPhoto(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    type: CourseType,
    photoId?: number,
  ): Promise<void> {
    if (type === CourseType.category) {
      if (!photoId) {
        throw createError(i18n, errorTitle, 'courseSteps.noPhotoCategory');
      }
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, errorTitle, 'media.photoNotFound');
      }
    } else if (photoId) {
      throw createError(i18n, errorTitle, 'courseSteps.photoOnlyCategory');
    }
  }
}
