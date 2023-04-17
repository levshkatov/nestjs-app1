import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { TreesService } from './trees.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TreesService],
  exports: [TreesService],
})
export class TreesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
