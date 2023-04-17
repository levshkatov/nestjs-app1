import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserSocialScopesMap } from './interfaces/user-social.interface';
import { UserSocial } from './user-social.model';

@Injectable()
export class UserSocialOrmService extends MainOrmService<UserSocial, UserSocialScopesMap> {
  constructor(
    @InjectModel(UserSocial)
    private userSocial: typeof UserSocial,
  ) {
    super(userSocial);
    logClassName(this.constructor.name, __filename);
  }
}
