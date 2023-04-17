import { Module } from '@nestjs/common';
import { logClassName } from '../../helpers/log-classname.helper';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

@Module({
  imports: [],
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
