import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { taskTypeOrders } from '../../../../orm/modules/tasks/types/scopes/task-type.scopes';
import { TaskTypeOrmService } from '../../../../orm/modules/tasks/types/task-type-orm.service';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { TaskTypeDto, TaskTypeReqDto } from './dtos/task-type.dto';
import { TaskTypesMapper } from './task-types.mapper';

@Injectable()
export class TaskTypesService {
  constructor(private taskTypes: TaskTypeOrmService, private taskTypesMapper: TaskTypesMapper) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<TaskTypeDto[]> {
    return (
      await this.taskTypes.getAll(
        {
          order: [['name', 'ASC'], taskTypeOrders.includeIndex, taskTypeOrders.includeName],
        },
        ['include'],
      )
    ).map((taskType) => this.taskTypesMapper.toTaskTypeDto(i18n, taskType));
  }

  async getOne(i18n: I18nContext, { name }: TaskTypeReqDto): Promise<TaskTypeDto> {
    const taskType = await this.taskTypes.getOneFromAll(
      {
        where: { name },
        order: [['name', 'ASC'], taskTypeOrders.includeIndex, taskTypeOrders.includeName],
      },
      ['include'],
    );
    if (!taskType) {
      throw createError(i18n, 'get', 'tasks.taskTypeNotFound');
    }

    return this.taskTypesMapper.toTaskTypeDto(i18n, taskType);
  }
}
