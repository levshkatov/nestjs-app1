import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingService } from '../interesting.service';
import { InterestingChecklistsController } from './interesting-checklists.controller';
import { InterestingChecklistsService } from './interesting-checklists.service';

@Module({
  imports: [],
  controllers: [InterestingChecklistsController],
  providers: [InterestingChecklistsService, InterestingService],
})
export class InterestingChecklistsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
