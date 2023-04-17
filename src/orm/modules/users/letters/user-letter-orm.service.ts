import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserLetterScopesMap } from './interfaces/user-letter.interface';
import { UserLetter } from './user-letter.model';

@Injectable()
export class UserLetterOrmService extends MainOrmService<UserLetter, UserLetterScopesMap> {
  constructor(@InjectModel(UserLetter) private userLetter: typeof UserLetter) {
    super(userLetter);
    logClassName(this.constructor.name, __filename);
  }
}
