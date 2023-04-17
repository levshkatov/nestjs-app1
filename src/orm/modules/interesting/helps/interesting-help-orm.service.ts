import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingHelp } from './interesting-help.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingHelpScopesMap } from './interfaces/interesting-help.interface';
import { InterestingHelpI18n } from './interesting-help-i18n.model';
import { BulkCreateOptions, DestroyOptions } from 'sequelize';
import { CreationAttributes, Attributes } from 'sequelize/types';

@Injectable()
export class InterestingHelpOrmService extends MainOrmService<
  InterestingHelp,
  InterestingHelpScopesMap
> {
  constructor(
    @InjectModel(InterestingHelp)
    private interestingHelp: typeof InterestingHelp,

    @InjectModel(InterestingHelpI18n)
    private interestingHelpI18n: typeof InterestingHelpI18n,
  ) {
    super(interestingHelp);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<InterestingHelpI18n>>,
    options?: BulkCreateOptions<Attributes<InterestingHelpI18n>>,
  ): Promise<Attributes<InterestingHelpI18n>[]> {
    return MainOrmService.bulkCreate(this.interestingHelpI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<InterestingHelpI18n>>): Promise<number> {
    return MainOrmService.destroy(this.interestingHelpI18n, options);
  }
}
