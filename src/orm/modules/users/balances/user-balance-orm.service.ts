import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserBalanceScopesMap } from './interfaces/user-balance.interface';
import { UserBalance } from './user-balance.model';

@Injectable()
export class UserBalanceOrmService extends MainOrmService<UserBalance, UserBalanceScopesMap> {
  constructor(@InjectModel(UserBalance) private userBalance: typeof UserBalance) {
    super(userBalance);
    logClassName(this.constructor.name, __filename);
  }
}
