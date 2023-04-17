import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../pop-up/pop-up.service';
import { TasksMapper } from './tasks.mapper';
import { TaskDto, TaskWithoutContentDto } from './dtos/task.dto';
import { TaskOrmService } from '../../../orm/modules/tasks/task-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';

@Injectable()
export class TasksService {
  constructor(
    private popup: PopUpService,
    private tasks: TaskOrmService,
    private tasksMapper: TasksMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<TaskWithoutContentDto[]> {
    return (await this.tasks.getAll({ order: [['id', 'DESC']] })).map((task) =>
      this.tasksMapper.toTaskWithoutContentDto(i18n, task),
    );
  }

  async getOne(i18n: I18nContext, id: number): Promise<TaskDto> {
    const task = await this.tasks.getOneFromAll({ where: { id } }, ['i18n']);
    if (!task) {
      throw this.popup.error(i18n, `tasks.notFound`);
    }
    return this.tasksMapper.toTaskDto(i18n, task);
  }
}
