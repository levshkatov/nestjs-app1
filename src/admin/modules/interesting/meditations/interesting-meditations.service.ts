import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingCategoryType } from '../../../../orm/modules/interesting/categories/interfaces/interesting-category-type.enum';
import { InterestingMeditationOrmService } from '../../../../orm/modules/interesting/meditations/interesting-meditation-orm.service';
import { IInterestingMeditation } from '../../../../orm/modules/interesting/meditations/interfaces/interesting-meditation.interface';
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
  InterestingMeditationsForListDto,
  InterestingMeditationCreateReqDto,
  InterestingMeditationDetailedDto,
  InterestingMeditationEditReqDto,
  InterestingMeditationsReqDto,
} from './dtos/interesting-meditation.dto';
import { InterestingMeditationsMapper } from './interesting-meditations.mapper';

@Injectable()
export class InterestingMeditationsService {
  constructor(
    private i18n: I18nHelperService,
    private meditations: InterestingMeditationOrmService,
    private meditationsMapper: InterestingMeditationsMapper,
    private media: MediaOrmService,
    private interesting: InterestingService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingMeditationsForListDto> {
    const {
      pages,
      total,
      rows: meditations,
    } = await this.meditations.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['i18n', 'audioFemale', 'audioMale', 'category', 'photo'],
      `"InterestingMeditation"."id"`,
    );

    return {
      pages,
      total,
      interestingMeditations: meditations.map((meditation) =>
        this.meditationsMapper.toInterestingMeditationForListDto(i18n, meditation),
      ),
    };
  }

  async create(
    i18n: I18nContext,
    {
      audioFemaleId,
      audioMaleId,
      categoryId,
      photoId,
      translations,
    }: InterestingMeditationCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    if (!(await this.media.getOne({ where: { id: audioFemaleId, type: MediaType.audio } }))) {
      throw createError(i18n, 'create', 'media.audioNotFound');
    }

    if (!audioMaleId) {
      audioMaleId = audioFemaleId;
    } else {
      if (!(await this.media.getOne({ where: { id: audioMaleId, type: MediaType.audio } }))) {
        throw createError(i18n, 'create', 'media.audioNotFound');
      }
    }

    await this.interesting.checkCategory(
      i18n,
      'create',
      categoryId,
      InterestingCategoryType.meditation,
    );

    const meditation = await this.meditations.create({
      disabled: true,
      photoId,
      audioFemaleId,
      audioMaleId,
      categoryId,
    });

    await this.meditations.createI18n(
      this.i18n.createTranslations(translations, { interestingMeditationId: meditation.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingMeditationDetailedDto> {
    const meditation = await this.meditations.getOneFromAll({ where: { id } }, [
      'i18n',
      'audioFemale',
      'audioMale',
      'category',
      'photo',
    ]);
    if (!meditation) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    return this.meditationsMapper.toInterestingMeditationDetailedDto(i18n, meditation);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    {
      audioFemaleId,
      audioMaleId,
      categoryId,
      photoId,
      translations,
      disabled,
    }: InterestingMeditationEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const meditation = await this.meditations.getOneFromAll({ where: { id } });
    if (!meditation) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const meditationUpdate: Partial<GetRequired<IInterestingMeditation>> = {};

    if (photoId !== meditation.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      meditationUpdate.photoId = photoId;
    }

    if (audioFemaleId !== meditation.audioFemaleId) {
      if (!(await this.media.getOne({ where: { id: audioFemaleId, type: MediaType.audio } }))) {
        throw createError(i18n, 'edit', 'media.audioNotFound');
      }
      meditationUpdate.audioFemaleId = audioFemaleId;
    }

    if (audioMaleId && audioMaleId !== meditation.audioMaleId) {
      if (!(await this.media.getOne({ where: { id: audioMaleId, type: MediaType.audio } }))) {
        throw createError(i18n, 'edit', 'media.audioNotFound');
      }
      meditationUpdate.audioMaleId = audioMaleId;
    }

    if (categoryId !== meditation.categoryId) {
      await this.interesting.checkCategory(
        i18n,
        'edit',
        categoryId,
        InterestingCategoryType.meditation,
      );
      meditationUpdate.categoryId = categoryId;
    }

    if (disabled !== undefined && disabled !== meditation.disabled && role === UserRole.webAdmin) {
      meditationUpdate.disabled = disabled;
    }

    if (Object.keys(meditationUpdate).length) {
      await this.meditations.update(meditationUpdate, { where: { id } });
    }

    await this.meditations.destroyI18n({ where: { interestingMeditationId: id } });
    await this.meditations.createI18n(
      this.i18n.createTranslations(translations, { interestingMeditationId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    if ((await this.meditations.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
