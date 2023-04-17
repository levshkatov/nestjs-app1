import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingService } from '../interesting.service';
import { InterestingMeditationsController } from './interesting-meditations.controller';
import { InterestingMeditationsService } from './interesting-meditations.service';

@Module({
  imports: [],
  controllers: [InterestingMeditationsController],
  providers: [InterestingMeditationsService, InterestingService],
})
export class InterestingMeditationsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
