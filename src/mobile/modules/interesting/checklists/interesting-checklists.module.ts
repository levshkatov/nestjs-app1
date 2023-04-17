import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingChecklistsController } from './interesting-checklists.controller';
import { InterestingChecklistsService } from './interesting-checklists.service';

@Module({
  imports: [],
  controllers: [InterestingChecklistsController],
  providers: [InterestingChecklistsService],
})
export class InterestingChecklistsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
