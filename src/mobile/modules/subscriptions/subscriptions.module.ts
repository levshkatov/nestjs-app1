import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { TelegramHelperModule } from '../../../shared/modules/telegram/telegram-helper.module';
import { AppStoreConnect } from './apple/app-store-connect.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [JwtModule.register({}), HttpModule, TelegramHelperModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, AppStoreConnect],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
