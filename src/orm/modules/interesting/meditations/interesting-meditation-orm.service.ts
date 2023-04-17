import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingMeditation } from './interesting-meditation.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingMeditationScopesMap } from './interfaces/interesting-meditation.interface';
import { InterestingMeditationI18n } from './interesting-meditation-i18n.model';
import { BulkCreateOptions, DestroyOptions } from 'sequelize';
import { CreationAttributes, Attributes } from 'sequelize/types';

@Injectable()
export class InterestingMeditationOrmService extends MainOrmService<
  InterestingMeditation,
  InterestingMeditationScopesMap
> {
  constructor(
    @InjectModel(InterestingMeditation)
    private interestingMeditation: typeof InterestingMeditation,

    @InjectModel(InterestingMeditationI18n)
    private interestingMeditationI18n: typeof InterestingMeditationI18n,
  ) {
    super(interestingMeditation);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<InterestingMeditationI18n>>,
    options?: BulkCreateOptions<Attributes<InterestingMeditationI18n>>,
  ): Promise<Attributes<InterestingMeditationI18n>[]> {
    return MainOrmService.bulkCreate(this.interestingMeditationI18n, records, options);
  }

  async destroyI18n(
    options?: DestroyOptions<Attributes<InterestingMeditationI18n>>,
  ): Promise<number> {
    return MainOrmService.destroy(this.interestingMeditationI18n, options);
  }
}
