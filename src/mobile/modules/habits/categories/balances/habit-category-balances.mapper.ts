import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IHabitCategoryBalance,
  HabitCategoryBalanceScopesMap,
} from '../../../../../orm/modules/habits/categories/balances/interfaces/habit-category-balance.interface';
import { BS } from '../../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../../media/media.mapper';
import { HabitCategoryBalanceNewDto } from './dtos/habit-category-balance.dto';

@Injectable()
export class HabitCategoryBalancesMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toHabitCategoryBalanceNewDto(
    i18nContext: I18nContext,
    { i18n, photo }: BS<IHabitCategoryBalance, HabitCategoryBalanceScopesMap, 'i18n' | 'photo'>,
  ): HabitCategoryBalanceNewDto {
    return {
      name: this.i18n.getValue(i18nContext, i18n, 'iconName'),
      text: this.i18n.getValue(i18nContext, i18n, 'iconNewCaption'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
