import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingCoachingsController } from './interesting-coachings.controller';
import { InterestingCoachingsService } from './interesting-coachings.service';

@Module({
  imports: [],
  controllers: [InterestingCoachingsController],
  providers: [InterestingCoachingsService],
})
export class InterestingCoachingsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
