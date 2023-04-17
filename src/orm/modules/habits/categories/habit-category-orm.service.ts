import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { HabitCategory } from './habit-category.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { HabitCategoryScopesMap } from './interfaces/habit-category.interface';
import { HabitCategoryI18n } from './habit-category-i18n.model';
import { Attributes, BulkCreateOptions, CreationAttributes, DestroyOptions } from 'sequelize';

@Injectable()
export class HabitCategoryOrmService extends MainOrmService<HabitCategory, HabitCategoryScopesMap> {
  constructor(
    @InjectModel(HabitCategory)
    private habitCategory: typeof HabitCategory,

    @InjectModel(HabitCategoryI18n)
    private habitCategoryI18n: typeof HabitCategoryI18n,
  ) {
    super(habitCategory);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<HabitCategoryI18n>>,
    options?: BulkCreateOptions<Attributes<HabitCategoryI18n>>,
  ): Promise<Attributes<HabitCategoryI18n>[]> {
    return MainOrmService.bulkCreate(this.habitCategoryI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<HabitCategoryI18n>>): Promise<number> {
    return MainOrmService.destroy(this.habitCategoryI18n, options);
  }
}
