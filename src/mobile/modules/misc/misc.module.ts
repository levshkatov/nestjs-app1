import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { CryptoHelperModule } from '../../../shared/modules/crypto/crypto-helper.module';
import { TelegramHelperModule } from '../../../shared/modules/telegram/telegram-helper.module';
import { MiscController } from './misc.controller';
import { MiscService } from './misc.service';

@Module({
  imports: [CryptoHelperModule, TelegramHelperModule],
  controllers: [MiscController],
  providers: [MiscService],
})
export class MiscModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
