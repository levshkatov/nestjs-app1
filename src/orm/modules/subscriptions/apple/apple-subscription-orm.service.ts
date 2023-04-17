import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { AppleSubscription } from './apple-subscription.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { AppleSubscriptionScopesMap } from './interfaces/apple-subscription.interface';

@Injectable()
export class AppleSubscriptionOrmService extends MainOrmService<
  AppleSubscription,
  AppleSubscriptionScopesMap
> {
  constructor(
    @InjectModel(AppleSubscription)
    private appleSubscription: typeof AppleSubscription,
  ) {
    super(appleSubscription);
    logClassName(this.constructor.name, __filename);
  }
}
