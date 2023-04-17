import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IHabitCategoryBalanceI18n } from '../../../../orm/modules/habits/categories/balances/interfaces/habit-category-balance-i18n.interface';
import {
  IHabitCategoryBalance,
  HabitCategoryBalanceScopesMap,
} from '../../../../orm/modules/habits/categories/balances/interfaces/habit-category-balance.interface';
import { IHabitCategoryI18n } from '../../../../orm/modules/habits/categories/interfaces/habit-category-i18n.interface';
import {
  IHabitCategory,
  HabitCategoryScopesMap,
} from '../../../../orm/modules/habits/categories/interfaces/habit-category.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import { MediaMapper } from '../../media/media.mapper';
import {
  HabitCategoryBalanceDetailedDto,
  HabitCategoryBalanceForListDto,
  HabitCategoryBalanceI18nDto,
} from './dtos/habit-category-balance.dto';
import {
  HabitCategoryDetailedDto,
  HabitCategoryForListDto,
  HabitCategoryI18nDto,
} from './dtos/habit-category.dto';

@Injectable()
export class HabitCategoriesMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toHabitCategorySimpleDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IHabitCategory, HabitCategoryScopesMap, 'i18n'>,
  ): ObjectSimpleDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
    };
  }

  toHabitCategoryForListDto(
    i18nContext: I18nContext,
    {
      id,
      i18n,
      photo,
      balance,
    }: BS<IHabitCategory, HabitCategoryScopesMap, 'i18n' | 'photo' | 'balance'>,
  ): HabitCategoryForListDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      balance: this.toHabitCategoryBalanceForListDto(i18nContext, balance),
    };
  }

  toHabitCategoryDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      photo,
      i18n,
      balance,
    }: BS<IHabitCategory, HabitCategoryScopesMap, 'i18n' | 'photo' | 'balance'>,
    disclaimer?: string,
  ): HabitCategoryDetailedDto {
    return {
      disclaimer,
      id,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      balance: this.toHabitCategoryBalanceDetailedDto(i18nContext, balance),
      translations: i18n.map((el) => this.toHabitCategoryI18nDto(i18nContext, el)),
    };
  }

  toHabitCategoryI18nDto(
    i18nContext: I18nContext,
    { lang, name, habitCaption }: IHabitCategoryI18n,
  ): HabitCategoryI18nDto {
    return {
      lang,
      name,
      habitCaption,
    };
  }

  toHabitCategoryBalanceForListDto(
    i18nContext: I18nContext,
    { i18n, photo }: BS<IHabitCategoryBalance, HabitCategoryBalanceScopesMap, 'i18n' | 'photo'>,
  ): HabitCategoryBalanceForListDto {
    return {
      iconName: this.i18n.getValue(i18nContext, i18n, 'iconName'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }

  toHabitCategoryBalanceDetailedDto(
    i18nContext: I18nContext,
    { photo, i18n }: BS<IHabitCategoryBalance, HabitCategoryBalanceScopesMap, 'i18n' | 'photo'>,
  ): HabitCategoryBalanceDetailedDto {
    return {
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      translations: i18n.map((el) => this.toHabitCategoryBalanceI18nDto(i18nContext, el)),
    };
  }

  toHabitCategoryBalanceI18nDto(
    i18nContext: I18nContext,
    {
      lang,
      iconName,
      iconCaption,
      iconClosedCaption,
      iconNewCaption,
      balanceCaptions,
    }: IHabitCategoryBalanceI18n,
  ): HabitCategoryBalanceI18nDto {
    return {
      lang,
      iconName,
      iconCaption,
      iconClosedCaption,
      iconNewCaption,
      balanceCaptions,
    };
  }
}
