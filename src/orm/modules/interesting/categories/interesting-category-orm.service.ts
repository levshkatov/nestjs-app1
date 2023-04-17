import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingCategory } from './interesting-category.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingCategoryScopesMap } from './interfaces/interesting-category.interface';
import { BulkCreateOptions, DestroyOptions } from 'sequelize';
import { CreationAttributes, Attributes } from 'sequelize/types';
import { InterestingCategoryI18n } from './interesting-category-i18n.model';

@Injectable()
export class InterestingCategoryOrmService extends MainOrmService<
  InterestingCategory,
  InterestingCategoryScopesMap
> {
  constructor(
    @InjectModel(InterestingCategory)
    private interestingCategory: typeof InterestingCategory,

    @InjectModel(InterestingCategoryI18n)
    private interestingCategoryI18n: typeof InterestingCategoryI18n,
  ) {
    super(interestingCategory);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<InterestingCategoryI18n>>,
    options?: BulkCreateOptions<Attributes<InterestingCategoryI18n>>,
  ): Promise<Attributes<InterestingCategoryI18n>[]> {
    return MainOrmService.bulkCreate(this.interestingCategoryI18n, records, options);
  }

  async destroyI18n(
    options?: DestroyOptions<Attributes<InterestingCategoryI18n>>,
  ): Promise<number> {
    return MainOrmService.destroy(this.interestingCategoryI18n, options);
  }
}
