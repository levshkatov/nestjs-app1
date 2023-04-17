import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LevelsService } from './levels.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LevelsService],
  exports: [LevelsService],
})
export class LevelsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
