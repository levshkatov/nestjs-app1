import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { UserBalancesMapper } from './user-balances.mapper';
import { UserBalanceDto, UserIconsDto } from './dtos/user-balance.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { UserOrmService } from '../../../../orm/modules/users/user-orm.service';
import { HabitCategoryBalanceOrmService } from '../../../../orm/modules/habits/categories/balances/habit-category-balance-orm.service';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class UserBalancesService {
  constructor(
    private popup: PopUpService,
    private userBalancesMapper: UserBalancesMapper,
    private habitCategoryBalances: HabitCategoryBalanceOrmService,
    private users: UserOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async get(i18n: I18nContext, { userId }: IJWTUser): Promise<UserBalanceDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', ['balances']);
    if (!user) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    const userBalances = user.balances.map((balance) =>
      this.userBalancesMapper.toUserHabitCategoryBalanceDto(i18n, balance),
    );

    const userBalancesDefault = (
      await this.habitCategoryBalances.getAll({ order: [['habitCategoryId', 'ASC']] }, [
        'i18n',
        'habitCategory',
      ])
    ).map((balance) =>
      this.userBalancesMapper.toUserHabitCategoryBalanceDto(i18n, {
        ...balance,
        UserBalance: { total: 0, isCompleted: false },
      }),
    );

    const categories = userBalancesDefault.map(
      (userBalanceDefault) =>
        userBalances.find((userBalance) => userBalance.id === userBalanceDefault.id) ||
        userBalanceDefault,
    );

    const totalBalance = categories.reduce((acc, { totalBalance }) => acc + totalBalance, 0);
    const maxBalance = categories.reduce((acc, { maxBalance }) => acc + maxBalance, 0);

    const iconNumber = Math.ceil((totalBalance / maxBalance) * 9) + 1;

    return new UserBalanceDto({
      totalBalance,
      maxBalance,
      iconNumber: iconNumber < 1 ? 1 : iconNumber > 10 ? 10 : iconNumber,
      categories,
    });
  }

  async getIcons(i18n: I18nContext, { userId }: IJWTUser): Promise<UserIconsDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', [
      'balancesCompleted',
    ]);
    if (!user) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    const completedCategoryIds = user.balances.map(({ habitCategoryId }) => habitCategoryId);

    const icons = (await this.habitCategoryBalances.getAll({}, ['photo', 'i18n']))
      .map((balance) =>
        this.userBalancesMapper.toUserIconDto(
          i18n,
          balance,
          completedCategoryIds.includes(balance.habitCategoryId) ? false : true,
        ),
      )
      .sort(({ disabled: x }, { disabled: y }) => (x === y ? 0 : x ? 1 : -1));

    return new UserIconsDto({ icons });
  }
}
