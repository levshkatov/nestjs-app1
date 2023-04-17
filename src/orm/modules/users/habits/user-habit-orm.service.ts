import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserHabitScopesMap } from './interfaces/user-habit.interface';
import { UserHabit } from './user-habit.model';

@Injectable()
export class UserHabitOrmService extends MainOrmService<UserHabit, UserHabitScopesMap> {
  constructor(@InjectModel(UserHabit) private userHabit: typeof UserHabit) {
    super(userHabit);
    logClassName(this.constructor.name, __filename);
  }
}
