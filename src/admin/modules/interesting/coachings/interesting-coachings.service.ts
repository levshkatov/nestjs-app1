import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ExerciseOrmService } from '../../../../orm/modules/exercises/exercise-orm.service';
import { InterestingCategoryType } from '../../../../orm/modules/interesting/categories/interfaces/interesting-category-type.enum';
import { InterestingCoachingOrmService } from '../../../../orm/modules/interesting/coachings/interesting-coaching-orm.service';
import { IInterestingCoaching } from '../../../../orm/modules/interesting/coachings/interfaces/interesting-coaching.interface';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import { MediaOrmService } from '../../../../orm/modules/media/media-orm.service';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { InterestingService } from '../interesting.service';
import {
  InterestingCoachingsForListDto,
  InterestingCoachingCreateReqDto,
  InterestingCoachingDetailedDto,
  InterestingCoachingEditReqDto,
  InterestingCoachingsReqDto,
} from './dtos/interesting-coaching.dto';
import { InterestingCoachingsMapper } from './interesting-coachings.mapper';

@Injectable()
export class InterestingCoachingsService {
  constructor(
    private i18n: I18nHelperService,
    private coachings: InterestingCoachingOrmService,
    private coachingsMapper: InterestingCoachingsMapper,
    private media: MediaOrmService,
    private interesting: InterestingService,
    private exercises: ExerciseOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingCoachingsForListDto> {
    const {
      pages,
      total,
      rows: coachings,
    } = await this.coachings.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['category', 'exerciseSimple', 'photo'],
      `"InterestingCoaching"."id"`,
    );

    return {
      pages,
      total,
      interestingCoachings: coachings.map((coaching) =>
        this.coachingsMapper.toInterestingCoachingForListDto(i18n, coaching),
      ),
    };
  }

  async create(
    i18n: I18nContext,
    { categoryId, exerciseId, photoId }: InterestingCoachingCreateReqDto,
  ): Promise<OkDto> {
    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    if (!(await this.exercises.getOne({ where: { id: exerciseId } }))) {
      throw createError(i18n, 'create', 'exercises.notFound');
    }

    await this.interesting.checkCategory(
      i18n,
      'create',
      categoryId,
      InterestingCategoryType.coaching,
    );

    const coaching = await this.coachings.create({
      disabled: true,
      photoId,
      exerciseId,
      categoryId,
    });

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingCoachingDetailedDto> {
    const coaching = await this.coachings.getOneFromAll({ where: { id } }, [
      'category',
      'exerciseSimple',
      'photo',
    ]);
    if (!coaching) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    return this.coachingsMapper.toInterestingCoachingDetailedDto(i18n, coaching);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { categoryId, exerciseId, photoId, disabled }: InterestingCoachingEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const coaching = await this.coachings.getOneFromAll({ where: { id } });
    if (!coaching) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    const coachingUpdate: Partial<GetRequired<IInterestingCoaching>> = {};

    if (photoId !== coaching.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      coachingUpdate.photoId = photoId;
    }

    if (exerciseId !== coaching.exerciseId) {
      if (!(await this.exercises.getOne({ where: { id: exerciseId } }))) {
        throw createError(i18n, 'edit', 'exercises.notFound');
      }
      coachingUpdate.exerciseId = exerciseId;
    }

    if (categoryId !== coaching.categoryId) {
      await this.interesting.checkCategory(
        i18n,
        'edit',
        categoryId,
        InterestingCategoryType.coaching,
      );
      coachingUpdate.categoryId = categoryId;
    }

    if (disabled !== undefined && disabled !== coaching.disabled && role === UserRole.webAdmin) {
      coachingUpdate.disabled = disabled;
    }

    if (Object.keys(coachingUpdate).length) {
      await this.coachings.update(coachingUpdate, { where: { id } });
    }

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    if ((await this.coachings.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
