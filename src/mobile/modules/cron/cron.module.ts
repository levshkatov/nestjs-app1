import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { CronService } from './cron.service';

@Module({
  imports: [SubscriptionsModule],
  providers: [CronService],
})
export class CronModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
