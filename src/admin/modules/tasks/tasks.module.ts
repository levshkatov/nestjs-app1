import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { TaskCategoriesController } from './categories/task-categories.controller';
import { TaskCategoriesService } from './categories/task-categories.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskTypesController } from './types/task-types.controller';
import { TaskTypesService } from './types/task-types.service';

@Module({
  imports: [],
  controllers: [TaskTypesController, TaskCategoriesController, TasksController],
  providers: [TasksService, TaskTypesService, TaskCategoriesService],
})
export class TasksModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
