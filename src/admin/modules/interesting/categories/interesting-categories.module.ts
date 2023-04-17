import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingCategoriesController } from './interesting-categories.controller';
import { InterestingCategoriesService } from './interesting-categories.service';

@Module({
  imports: [],
  controllers: [InterestingCategoriesController],
  providers: [InterestingCategoriesService],
})
export class InterestingCategoriesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
