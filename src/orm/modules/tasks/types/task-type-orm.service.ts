import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { TaskTypeScopesMap } from './interfaces/task-type.interface';
import { TaskType } from './task-type.model';

@Injectable()
export class TaskTypeOrmService extends MainOrmService<TaskType, TaskTypeScopesMap> {
  constructor(
    @InjectModel(TaskType)
    private taskType: typeof TaskType,
  ) {
    super(taskType);
    logClassName(this.constructor.name, __filename);
  }
}
