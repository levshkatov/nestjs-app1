import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserClaimScopesMap } from './interfaces/user-claim.interface';
import { UserClaim } from './user-claim.model';

@Injectable()
export class UserClaimOrmService extends MainOrmService<UserClaim, UserClaimScopesMap> {
  constructor(
    @InjectModel(UserClaim)
    private userClaim: typeof UserClaim,
  ) {
    super(userClaim);
    logClassName(this.constructor.name, __filename);
  }
}
