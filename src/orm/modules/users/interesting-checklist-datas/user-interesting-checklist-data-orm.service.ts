import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { UserInterestingChecklistDataScopesMap } from './interfaces/user-interesting-checklist-data.interface';
import { UserInterestingChecklistData } from './user-interesting-checklist-data.model';

@Injectable()
export class UserInterestingChecklistDataOrmService extends MainOrmService<
  UserInterestingChecklistData,
  UserInterestingChecklistDataScopesMap
> {
  constructor(
    @InjectModel(UserInterestingChecklistData)
    private userInterestingChecklistData: typeof UserInterestingChecklistData,
  ) {
    super(userInterestingChecklistData);
    logClassName(this.constructor.name, __filename);
  }
}
