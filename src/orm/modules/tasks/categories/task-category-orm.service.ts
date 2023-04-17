import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { TaskCategoryScopesMap } from './interfaces/task-category.interface';
import { TaskCategory } from './task-category.model';

@Injectable()
export class TaskCategoryOrmService extends MainOrmService<TaskCategory, TaskCategoryScopesMap> {
  constructor(
    @InjectModel(TaskCategory)
    private taskCategory: typeof TaskCategory,
  ) {
    super(taskCategory);
    logClassName(this.constructor.name, __filename);
  }
}
