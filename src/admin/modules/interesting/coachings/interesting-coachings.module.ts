import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingService } from '../interesting.service';
import { InterestingCoachingsController } from './interesting-coachings.controller';
import { InterestingCoachingsService } from './interesting-coachings.service';

@Module({
  imports: [],
  controllers: [InterestingCoachingsController],
  providers: [InterestingCoachingsService, InterestingService],
})
export class InterestingCoachingsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
