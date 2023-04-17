import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserVerifyCodeScopesMap } from './interfaces/user-verify-code.interface';
import { UserVerifyCode } from './user-verify-code.model';

@Injectable()
export class UserVerifyCodeOrmService extends MainOrmService<
  UserVerifyCode,
  UserVerifyCodeScopesMap
> {
  constructor(
    @InjectModel(UserVerifyCode)
    private userVerifyCode: typeof UserVerifyCode,
  ) {
    super(userVerifyCode);
    logClassName(this.constructor.name, __filename);
  }
}
