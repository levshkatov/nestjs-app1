import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingHelpsController } from './interesting-helps.controller';
import { InterestingHelpsService } from './interesting-helps.service';

@Module({
  imports: [],
  controllers: [InterestingHelpsController],
  providers: [InterestingHelpsService],
})
export class InterestingHelpsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
