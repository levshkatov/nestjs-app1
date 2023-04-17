import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { HabitCategoryBalanceOrmService } from '../../../../orm/modules/habits/categories/balances/habit-category-balance-orm.service';
import { IHabitCategoryBalance } from '../../../../orm/modules/habits/categories/balances/interfaces/habit-category-balance.interface';
import { HabitCategoryOrmService } from '../../../../orm/modules/habits/categories/habit-category-orm.service';
import { IHabitCategory } from '../../../../orm/modules/habits/categories/interfaces/habit-category.interface';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import { MediaOrmService } from '../../../../orm/modules/media/media-orm.service';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../../shared/helpers/create-disclaimer.helper';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../../shared/interfaces/paginated.interface';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import {
  HabitCategoriesForListDto,
  HabitCategoryCreateReqDto,
  HabitCategoryDetailedDto,
  HabitCategoryEditReqDto,
} from './dtos/habit-category.dto';
import { HabitCategoriesMapper } from './habit-categories.mapper';

@Injectable()
export class HabitCategoriesService {
  constructor(
    private i18n: I18nHelperService,
    private categories: HabitCategoryOrmService,
    private balances: HabitCategoryBalanceOrmService,
    private categoriesMapper: HabitCategoriesMapper,
    private media: MediaOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { offset, limit }: Pagination,
  ): Promise<HabitCategoriesForListDto> {
    const {
      pages,
      total,
      rows: categories,
    } = await this.categories.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'ASC']],
      },
      ['i18n', 'photo', 'balance'],
      '"HabitCategory"."id"',
    );

    return {
      pages,
      total,
      categories: categories.map((category) =>
        this.categoriesMapper.toHabitCategoryForListDto(i18n, category),
      ),
      disclaimer: createDisclaimer(i18n, 'habitCategories.forbiddenIfHasHabits'),
    };
  }

  async create(
    i18n: I18nContext,
    {
      photoId,
      balance: { photoId: balancePhotoId, translations: balanceTranslations },
      translations,
    }: HabitCategoryCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);
    this.i18n.checkFallbackLang(i18n, balanceTranslations);

    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }
    if (!(await this.media.getOne({ where: { id: balancePhotoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    const category = await this.categories.create({
      photoId,
    });

    await this.categories.createI18n(
      this.i18n.createTranslations(translations, { habitCategoryId: category.id }),
    );

    await this.balances.create({ habitCategoryId: category.id, photoId: balancePhotoId });

    await this.balances.createI18n(
      this.i18n.createTranslations(balanceTranslations, { habitCategoryBalanceId: category.id }),
    );

    return new OkDto();
  }

  async getAllSimple(i18n: I18nContext): Promise<ObjectSimpleDto[]> {
    return (await this.categories.getAll({ order: [['id', 'ASC']] }, ['i18n'])).map((category) =>
      this.categoriesMapper.toHabitCategorySimpleDto(i18n, category),
    );
  }

  async getOne(i18n: I18nContext, id: number): Promise<HabitCategoryDetailedDto> {
    const category = await this.categories.getOneFromAll({ where: { id } }, [
      'i18n',
      'photo',
      'balance',
    ]);
    if (!category) {
      throw createError(i18n, 'get', 'habits.categoryNotFound');
    }

    return this.categoriesMapper.toHabitCategoryDetailedDto(i18n, category);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    {
      photoId,
      balance: { photoId: balancePhotoId, translations: balanceTranslations },
      translations,
    }: HabitCategoryEditReqDto,
  ): Promise<OkDto> {
    const category = await this.categories.getOneFromAll({ where: { id } }, ['balance']);
    if (!category) {
      throw createError(i18n, 'edit', 'habits.categoryNotFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);
    this.i18n.checkFallbackLang(i18n, balanceTranslations);

    const categoryUpdate: Partial<GetRequired<IHabitCategory>> = {};
    const balanceUpdate: Partial<GetRequired<IHabitCategoryBalance>> = {};

    if (photoId !== category.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      categoryUpdate.photoId = photoId;
    }
    if (balancePhotoId !== category.balance.photoId) {
      if (!(await this.media.getOne({ where: { id: balancePhotoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      balanceUpdate.photoId = balancePhotoId;
    }

    if (Object.keys(categoryUpdate).length) {
      await this.categories.update(categoryUpdate, { where: { id } });
    }
    if (Object.keys(balanceUpdate).length) {
      await this.balances.update(balanceUpdate, { where: { habitCategoryId: id } });
    }

    await this.categories.destroyI18n({ where: { habitCategoryId: id } });
    await this.categories.createI18n(
      this.i18n.createTranslations(translations, { habitCategoryId: id }),
    );

    await this.balances.destroyI18n({ where: { habitCategoryBalanceId: id } });
    await this.balances.createI18n(
      this.i18n.createTranslations(balanceTranslations, { habitCategoryBalanceId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const category = await this.categories.getOneFromAll({ where: { id } }, ['habits']);
    if (!category) {
      throw createError(i18n, 'delete', 'habits.categoryNotFound');
    }

    if (category.habits.length) {
      throw createError(
        i18n,
        'delete',
        null,
        i18n.t('errors.habits.categoryHasHabits', {
          args: { id: category.habits.map(({ id }) => id).join(', ') },
        }),
      );
    }

    if ((await this.categories.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'habits.categoryNotFound');
    }

    return new OkDto();
  }
}
