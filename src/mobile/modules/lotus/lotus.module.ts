import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LotusController } from './lotus.controller';
import { LotusService } from './lotus.service';

@Module({
  imports: [],
  controllers: [LotusController],
  providers: [LotusService],
})
export class LotusModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
