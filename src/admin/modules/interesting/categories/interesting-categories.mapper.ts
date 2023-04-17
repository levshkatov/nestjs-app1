import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IInterestingCategoryI18n } from '../../../../orm/modules/interesting/categories/interfaces/interesting-category-i18n.interface';
import {
  IInterestingCategory,
  InterestingCategoryScopesMap,
} from '../../../../orm/modules/interesting/categories/interfaces/interesting-category.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import {
  InterestingCategoryDetailedDto,
  InterestingCategoryI18nDto,
  InterestingCategoryForListDto,
} from './dtos/interesting-category.dto';

@Injectable()
export class InterestingCategoriesMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingCategoryForListDto(
    i18nContext: I18nContext,
    { id, type, i18n }: BS<IInterestingCategory, InterestingCategoryScopesMap, 'i18n'>,
  ): InterestingCategoryForListDto {
    return {
      id,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      type,
    };
  }

  toInterestingCategorySimpleDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IInterestingCategory, InterestingCategoryScopesMap, 'i18n'>,
  ): ObjectSimpleDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'title'),
    };
  }

  toInterestingCategoryDetailedDto(
    i18nContext: I18nContext,
    { id, type, i18n }: BS<IInterestingCategory, InterestingCategoryScopesMap, 'i18n'>,
    disclaimer?: string,
  ): InterestingCategoryDetailedDto {
    return {
      disclaimer,
      id,
      type,
      translations: i18n.map((el) => this.toInterestingCategoryI18nDto(i18nContext, el)),
    };
  }

  toInterestingCategoryI18nDto(
    i18nContext: I18nContext,
    { lang, title }: IInterestingCategoryI18n,
  ): InterestingCategoryI18nDto {
    return {
      lang,
      title,
    };
  }
}
