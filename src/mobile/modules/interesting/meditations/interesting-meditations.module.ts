import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingMeditationsController } from './interesting-meditations.controller';
import { InterestingMeditationsService } from './interesting-meditations.service';

@Module({
  imports: [],
  controllers: [InterestingMeditationsController],
  providers: [InterestingMeditationsService],
})
export class InterestingMeditationsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
