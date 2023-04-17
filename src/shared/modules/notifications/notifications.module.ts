import { Global, Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LoggerModule } from '../logger/logger.module';
import { NotificationsMapper } from './notifications.mapper';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [NotificationsService, NotificationsMapper],
  exports: [NotificationsService],
})
export class NotificationsModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
