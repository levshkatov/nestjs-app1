import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../../main-orm.service';
import { AppleSubscriptionNotification } from './apple-subscription-notification.model';
import { logClassName } from '../../../../../shared/helpers/log-classname.helper';
import { AppleSubscriptionNotificationScopesMap } from './interfaces/apple-subscription-notification.interface';

@Injectable()
export class AppleSubscriptionNotificationOrmService extends MainOrmService<
  AppleSubscriptionNotification,
  AppleSubscriptionNotificationScopesMap
> {
  constructor(
    @InjectModel(AppleSubscriptionNotification)
    private appleSubscriptionNotification: typeof AppleSubscriptionNotification,
  ) {
    super(appleSubscriptionNotification);
    logClassName(this.constructor.name, __filename);
  }
}
