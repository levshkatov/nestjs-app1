import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ExerciseOrmService } from '../../../orm/modules/exercises/exercise-orm.service';
import { exerciseOrders } from '../../../orm/modules/exercises/scopes/exercise.scopes';
import { UserCourseOrmService } from '../../../orm/modules/users/courses/user-course-orm.service';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../shared/helpers/create-disclaimer.helper';
import { createError } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import {
  ExercisesForListDto,
  ExerciseCreateReqDto,
  ExerciseDetailedDto,
  ExerciseEditReqDto,
  ExercisesReqDto,
} from './dtos/exercise.dto';
import { ExercisesMapper } from './exercises.mapper';

@Injectable()
export class ExercisesService {
  constructor(
    private i18n: I18nHelperService,
    private exercises: ExerciseOrmService,
    private exercisesMapper: ExercisesMapper,
    private userCourses: UserCourseOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: ExercisesReqDto,
  ): Promise<ExercisesForListDto> {
    const { pages, total, exercises } = await this.exercises.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      exercises: exercises.map((exercise) =>
        this.exercisesMapper.toExerciseForListDto(i18n, exercise),
      ),
      disclaimer: createDisclaimer(
        i18n,
        'exercises.forbiddenIfUsed',
        'exercises.forbiddenIfHasLinked',
      ),
    };
  }

  async create(i18n: I18nContext, { translations }: ExerciseCreateReqDto): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    const exercise = await this.exercises.create({});

    await this.exercises.createI18n(
      this.i18n.createTranslations(translations, { exerciseId: exercise.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<ExerciseDetailedDto> {
    const exercise = await this.exercises.getOneFromAll(
      {
        where: { id },
        order: [exerciseOrders.exerciseTasks],
      },
      ['i18n', 'exerciseTasks', 'courseStepExercises', 'interestingCoachings'],
    );
    if (!exercise) {
      throw createError(i18n, 'get', 'exercises.notFound');
    }

    const exerciseIsUsed = !exercise.courseStepExercises.length
      ? false
      : !!(await this.userCourses.getOne({
          where: { courseStepExerciseId: id, isCompleted: false },
        }));

    return this.exercisesMapper.toExerciseDetailedDto(
      i18n,
      exercise,
      exerciseIsUsed
        ? createDisclaimer(i18n, 'exercises.isUsed', 'exercises.forbiddenIfUsed')
        : undefined,
    );
  }

  async edit(i18n: I18nContext, id: number, { translations }: ExerciseEditReqDto): Promise<OkDto> {
    const exercise = await this.exercises.getOne({ where: { id } });
    if (!exercise) {
      throw createError(i18n, 'edit', 'exercises.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    await this.exercises.destroyI18n({ where: { exerciseId: id } });
    await this.exercises.createI18n(this.i18n.createTranslations(translations, { exerciseId: id }));

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const exercise = await this.exercises.getOneFromAll({ where: { id } }, [
      'courseStepExercises',
      'interestingCoachings',
    ]);
    if (!exercise) {
      throw createError(i18n, 'delete', 'exercises.notFound');
    }

    const errors: string[] = [];

    if (exercise.courseStepExercises.length) {
      errors.push(
        i18n.t('errors.exercises.hasCourseStepExercises', {
          args: {
            courses: exercise.courseStepExercises
              .map(
                ({
                  courseStep: {
                    course: { id },
                    index,
                  },
                }) => `${i18n.t(`titles.course`)} №${id}. ${i18n.t(`titles.courseStep`)} №${index}`,
              )
              .join('. '),
          },
        }),
      );
    }

    if (exercise.interestingCoachings.length) {
      errors.push(
        i18n.t('errors.exercises.hasCoachings', {
          args: { id: exercise.interestingCoachings.map(({ id }) => id).join(', ') },
        }),
      );
    }

    if (errors.length) {
      throw createError(i18n, 'delete', null, errors);
    }

    await this.exercises.destroy({ where: { id } });

    return new OkDto();
  }
}
