import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingCategoryOrmService } from '../../../../orm/modules/interesting/categories/interesting-category-orm.service';
import { IInterestingCategory } from '../../../../orm/modules/interesting/categories/interfaces/interesting-category.interface';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../../shared/helpers/create-disclaimer.helper';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { omitNullProps } from '../../../../shared/helpers/omit-null-props.helper';
import { Pagination } from '../../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import {
  InterestingCategoriesForListDto,
  InterestingCategoryCreateReqDto,
  InterestingCategoryDetailedDto,
  InterestingCategoryEditReqDto,
  InterestingCategoriesReqDto,
  InterestingCategoriesSimpleReqDto,
} from './dtos/interesting-category.dto';
import { InterestingCategoriesMapper } from './interesting-categories.mapper';

@Injectable()
export class InterestingCategoriesService {
  constructor(
    private i18n: I18nHelperService,
    private categories: InterestingCategoryOrmService,
    private categoriesMapper: InterestingCategoriesMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingCategoriesForListDto> {
    const {
      pages,
      total,
      rows: categories,
    } = await this.categories.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['i18n'],
      `"InterestingCategory"."id"`,
    );

    return {
      pages,
      total,
      interestingCategories: categories.map((category) =>
        this.categoriesMapper.toInterestingCategoryForListDto(i18n, category),
      ),
      disclaimer: createDisclaimer(i18n, 'interestingCategories.forbiddenIfHasLinked'),
    };
  }

  async create(
    i18n: I18nContext,
    { type, translations }: InterestingCategoryCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    const category = await this.categories.create({ type });

    await this.categories.createI18n(
      this.i18n.createTranslations(translations, { interestingCategoryId: category.id }),
    );

    return new OkDto();
  }

  async getAllSimple(
    i18n: I18nContext,
    { type }: InterestingCategoriesSimpleReqDto,
  ): Promise<ObjectSimpleDto[]> {
    return (
      await this.categories.getAll({ where: omitNullProps({ type }), order: [['id', 'DESC']] }, [
        'i18n',
      ])
    ).map((category) => this.categoriesMapper.toInterestingCategorySimpleDto(i18n, category));
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingCategoryDetailedDto> {
    const category = await this.categories.getOneFromAll({ where: { id } }, [
      'i18n',
      'checklists',
      'coachings',
      'meditations',
    ]);
    if (!category) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    return this.categoriesMapper.toInterestingCategoryDetailedDto(i18n, category);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { translations, type }: InterestingCategoryEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const category = await this.categories.getOneFromAll({ where: { id } });
    if (!category) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const categoryUpdate: Partial<GetRequired<IInterestingCategory>> = {};

    if (type !== category.type) {
      throw createError(i18n, 'edit', 'interesting.changeCategoryType');
    }

    if (Object.keys(categoryUpdate).length) {
      await this.categories.update(categoryUpdate, { where: { id } });
    }

    await this.categories.destroyI18n({ where: { interestingCategoryId: id } });
    await this.categories.createI18n(
      this.i18n.createTranslations(translations, { interestingCategoryId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const category = await this.categories.getOneFromAll({ where: { id } }, [
      'checklists',
      'coachings',
      'meditations',
    ]);
    if (!category) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }

    const errors: string[] = [];

    if (category.checklists.length) {
      errors.push(
        i18n.t('errors.interesting.categoryHasChecklists', {
          args: { id: category.checklists.map(({ id }) => id).join(', ') },
        }),
      );
    }

    if (category.coachings.length) {
      errors.push(
        i18n.t('errors.interesting.categoryHasCoachings', {
          args: { id: category.coachings.map(({ id }) => id).join(', ') },
        }),
      );
    }

    if (category.meditations.length) {
      errors.push(
        i18n.t('errors.interesting.categoryHasMeditations', {
          args: { id: category.meditations.map(({ id }) => id).join(', ') },
        }),
      );
    }

    if (errors.length) {
      throw createError(i18n, 'delete', null, errors);
    }

    if ((await this.categories.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
