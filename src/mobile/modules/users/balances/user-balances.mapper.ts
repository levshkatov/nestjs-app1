import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  HabitCategoryBalanceScopesMap,
  IHabitCategoryBalance,
} from '../../../../orm/modules/habits/categories/balances/interfaces/habit-category-balance.interface';
import { IUserBalance } from '../../../../orm/modules/users/balances/interfaces/user-balance.interface';
import { BS, ThroughR } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { UserHabitCategoryBalanceDto, UserIconDto } from './dtos/user-balance.dto';
import {
  HABIT_CATEGORY_BALANCE_DELIMITER,
  MAX_HABIT_CATEGORY_BALANCE,
} from './interfaces/user-balances.constants';

@Injectable()
export class UserBalancesMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toUserHabitCategoryBalanceDto(
    i18nContext: I18nContext,
    {
      UserBalance: { isCompleted, total },
      habitCategory: { id, i18n: i18nCategory, photo },
      i18n: i18nBalance,
    }: BS<IHabitCategoryBalance, HabitCategoryBalanceScopesMap, 'i18n' | 'habitCategory'> &
      ThroughR<'UserBalance', Pick<IUserBalance, 'total' | 'isCompleted'>>,
  ): UserHabitCategoryBalanceDto {
    const totalBalance = Math.floor(total / HABIT_CATEGORY_BALANCE_DELIMITER);

    return {
      id,
      name: i18nCategory[0]?.name || '',
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      totalBalance,
      maxBalance: MAX_HABIT_CATEGORY_BALANCE,
      isCompleted,
      mainCaption: i18nBalance[0]?.balanceCaptions[totalBalance] || '',
    };
  }

  toUserIconDto(
    i18nContext: I18nContext,
    { i18n, photo }: BS<IHabitCategoryBalance, HabitCategoryBalanceScopesMap, 'i18n' | 'photo'>,
    disabled: boolean,
  ): UserIconDto {
    return {
      disabled,
      name: this.i18n.getValue(i18nContext, i18n, 'iconName'),
      text: disabled
        ? this.i18n.getValue(i18nContext, i18n, 'iconClosedCaption')
        : this.i18n.getValue(i18nContext, i18n, 'iconCaption'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
