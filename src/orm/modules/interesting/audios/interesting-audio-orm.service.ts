import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingAudio } from './interesting-audio.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingAudioScopesMap } from './interfaces/interesting-audio.interface';
import { InterestingAudioI18n } from './interesting-audio-i18n.model';
import { BulkCreateOptions, DestroyOptions } from 'sequelize';
import { CreationAttributes, Attributes } from 'sequelize/types';

@Injectable()
export class InterestingAudioOrmService extends MainOrmService<
  InterestingAudio,
  InterestingAudioScopesMap
> {
  constructor(
    @InjectModel(InterestingAudio)
    private interestingAudio: typeof InterestingAudio,

    @InjectModel(InterestingAudioI18n)
    private interestingAudioI18n: typeof InterestingAudioI18n,
  ) {
    super(interestingAudio);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<InterestingAudioI18n>>,
    options?: BulkCreateOptions<Attributes<InterestingAudioI18n>>,
  ): Promise<Attributes<InterestingAudioI18n>[]> {
    return MainOrmService.bulkCreate(this.interestingAudioI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<InterestingAudioI18n>>): Promise<number> {
    return MainOrmService.destroy(this.interestingAudioI18n, options);
  }
}
