import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingArticlesController } from './interesting-articles.controller';
import { InterestingArticlesService } from './interesting-articles.service';

@Module({
  imports: [],
  controllers: [InterestingArticlesController],
  providers: [InterestingArticlesService],
})
export class InterestingArticlesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
