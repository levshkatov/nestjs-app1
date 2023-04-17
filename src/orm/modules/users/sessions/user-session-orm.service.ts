import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserSessionScopesMap } from './interfaces/user-session.interface';
import { UserSession } from './user-session.model';

@Injectable()
export class UserSessionOrmService extends MainOrmService<UserSession, UserSessionScopesMap> {
  constructor(
    @InjectModel(UserSession)
    private userSession: typeof UserSession,
  ) {
    super(userSession);
    logClassName(this.constructor.name, __filename);
  }
}
