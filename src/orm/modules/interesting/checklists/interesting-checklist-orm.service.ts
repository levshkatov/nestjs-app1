import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingChecklist } from './interesting-checklist.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingChecklistScopesMap } from './interfaces/interesting-checklist.interface';
import { InterestingChecklistI18n } from './interesting-checklist-i18n.model';
import { BulkCreateOptions, DestroyOptions } from 'sequelize';
import { CreationAttributes, Attributes } from 'sequelize/types';

@Injectable()
export class InterestingChecklistOrmService extends MainOrmService<
  InterestingChecklist,
  InterestingChecklistScopesMap
> {
  constructor(
    @InjectModel(InterestingChecklist)
    private interestingChecklist: typeof InterestingChecklist,

    @InjectModel(InterestingChecklistI18n)
    private interestingChecklistI18n: typeof InterestingChecklistI18n,
  ) {
    super(interestingChecklist);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<InterestingChecklistI18n>>,
    options?: BulkCreateOptions<Attributes<InterestingChecklistI18n>>,
  ): Promise<Attributes<InterestingChecklistI18n>[]> {
    return MainOrmService.bulkCreate(this.interestingChecklistI18n, records, options);
  }

  async destroyI18n(
    options?: DestroyOptions<Attributes<InterestingChecklistI18n>>,
  ): Promise<number> {
    return MainOrmService.destroy(this.interestingChecklistI18n, options);
  }
}
