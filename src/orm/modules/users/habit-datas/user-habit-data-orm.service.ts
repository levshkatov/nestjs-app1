import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserHabitDataScopesMap } from './interfaces/user-habit-data.interface';
import { UserHabitData } from './user-habit-data.model';

@Injectable()
export class UserHabitDataOrmService extends MainOrmService<UserHabitData, UserHabitDataScopesMap> {
  constructor(
    @InjectModel(UserHabitData)
    private userHabitData: typeof UserHabitData,
  ) {
    super(userHabitData);
    logClassName(this.constructor.name, __filename);
  }
}
