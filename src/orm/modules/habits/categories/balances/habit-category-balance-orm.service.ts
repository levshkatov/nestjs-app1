import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../../main-orm.service';
import { HabitCategoryBalance } from './habit-category-balance.model';
import { logClassName } from '../../../../../shared/helpers/log-classname.helper';
import { HabitCategoryBalanceScopesMap } from './interfaces/habit-category-balance.interface';
import { HabitCategoryBalanceI18n } from './habit-category-balance-i18n.model';
import { Attributes, BulkCreateOptions, CreationAttributes, DestroyOptions } from 'sequelize';

@Injectable()
export class HabitCategoryBalanceOrmService extends MainOrmService<
  HabitCategoryBalance,
  HabitCategoryBalanceScopesMap
> {
  constructor(
    @InjectModel(HabitCategoryBalance)
    private habitCategoryBalance: typeof HabitCategoryBalance,

    @InjectModel(HabitCategoryBalanceI18n)
    private habitCategoryBalanceI18n: typeof HabitCategoryBalanceI18n,
  ) {
    super(habitCategoryBalance);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<HabitCategoryBalanceI18n>>,
    options?: BulkCreateOptions<Attributes<HabitCategoryBalanceI18n>>,
  ): Promise<Attributes<HabitCategoryBalanceI18n>[]> {
    return MainOrmService.bulkCreate(this.habitCategoryBalanceI18n, records, options);
  }

  async destroyI18n(
    options?: DestroyOptions<Attributes<HabitCategoryBalanceI18n>>,
  ): Promise<number> {
    return MainOrmService.destroy(this.habitCategoryBalanceI18n, options);
  }
}
