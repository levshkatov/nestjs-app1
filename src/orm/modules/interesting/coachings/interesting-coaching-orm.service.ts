import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingCoaching } from './interesting-coaching.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingCoachingScopesMap } from './interfaces/interesting-coaching.interface';

@Injectable()
export class InterestingCoachingOrmService extends MainOrmService<
  InterestingCoaching,
  InterestingCoachingScopesMap
> {
  constructor(
    @InjectModel(InterestingCoaching)
    private interestingCoaching: typeof InterestingCoaching,
  ) {
    super(interestingCoaching);
    logClassName(this.constructor.name, __filename);
  }
}
