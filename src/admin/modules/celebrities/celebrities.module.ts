import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { CelebritiesController } from './celebrities.controller';
import { CelebritiesService } from './celebrities.service';

@Module({
  imports: [],
  controllers: [CelebritiesController],
  providers: [CelebritiesService],
})
export class CelebritiesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
