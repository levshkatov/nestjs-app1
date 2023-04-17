import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserCelebrityScopesMap } from './interfaces/user-celebrity.interface';
import { UserCelebrity } from './user-celebrity.model';

@Injectable()
export class UserCelebrityOrmService extends MainOrmService<UserCelebrity, UserCelebrityScopesMap> {
  constructor(@InjectModel(UserCelebrity) private userCelebrity: typeof UserCelebrity) {
    super(userCelebrity);
    logClassName(this.constructor.name, __filename);
  }
}
