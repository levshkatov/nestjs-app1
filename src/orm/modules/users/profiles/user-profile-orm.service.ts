import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserProfileScopesMap } from './interfaces/user-profile.interface';
import { UserProfile } from './user-profile.model';

@Injectable()
export class UserProfileOrmService extends MainOrmService<UserProfile, UserProfileScopesMap> {
  constructor(
    @InjectModel(UserProfile)
    private userProfile: typeof UserProfile,
  ) {
    super(userProfile);
    logClassName(this.constructor.name, __filename);
  }
}
