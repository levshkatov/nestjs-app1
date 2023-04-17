import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logClassName } from '../../helpers/log-classname.helper';
import { TelegramHelperService } from './telegram-helper.service';

@Module({
  imports: [HttpModule],
  providers: [ConfigService, TelegramHelperService],
  exports: [TelegramHelperService],
})
export class TelegramHelperModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
