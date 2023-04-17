import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserNotificationScopesMap } from './interfaces/user-notification.interface';
import { UserNotification } from './user-notification.model';

@Injectable()
export class UserNotificationOrmService extends MainOrmService<
  UserNotification,
  UserNotificationScopesMap
> {
  constructor(
    @InjectModel(UserNotification)
    private userNotification: typeof UserNotification,
  ) {
    super(userNotification);
    logClassName(this.constructor.name, __filename);
  }
}
