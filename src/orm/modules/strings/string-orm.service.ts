import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../main-orm.service';
import { StringScopesMap } from './interfaces/string.interface';
import { String as StringModel } from './string.model';

@Injectable()
export class StringOrmService extends MainOrmService<StringModel, StringScopesMap> {
  constructor(
    @InjectModel(StringModel)
    private string: typeof StringModel,
  ) {
    super(string);
    logClassName(this.constructor.name, __filename);
  }
}
