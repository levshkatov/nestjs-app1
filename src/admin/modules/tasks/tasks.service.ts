import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ITask } from '../../../orm/modules/tasks/interfaces/task.interface';
import { TaskOrmService } from '../../../orm/modules/tasks/task-orm.service';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../shared/helpers/create-disclaimer.helper';
import { createError } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { TaskErrorDto } from '../../../shared/modules/tasks/dtos/task.dto';
import { TasksBaseService } from '../../../shared/modules/tasks/tasks-base.service';
import { TaskCategoriesService } from './categories/task-categories.service';
import {
  TaskCreateReqDto,
  TaskDetailedDto,
  TaskEditReqDto,
  TasksForListDto,
  TasksReqDto,
} from './dtos/task.dto';
import { TasksMapper } from './tasks.mapper';
import { TaskTypesService } from './types/task-types.service';

@Injectable()
export class TasksService extends TasksBaseService {
  constructor(
    private i18n: I18nHelperService,
    private tasks: TaskOrmService,
    private tasksMapper: TasksMapper,
    taskTypesService: TaskTypesService,
    taskCategoriesService: TaskCategoriesService,
  ) {
    super(taskTypesService, taskCategoriesService);
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: TasksReqDto,
  ): Promise<TasksForListDto> {
    const { pages, total, tasks } = await this.tasks.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      tasks: tasks.map((task) => this.tasksMapper.toTaskForListDto(i18n, task)),
      disclaimer: createDisclaimer(i18n, 'tasks.forbiddenIfHasLinked'),
    };
  }

  async create(
    i18n: I18nContext,
    { name, categoryName, translations }: TaskCreateReqDto,
  ): Promise<OkDto | TaskErrorDto[]> {
    this.i18n.checkFallbackLang(i18n, translations);

    for (const translation of translations) {
      const errors = await this.validateContent(i18n, categoryName, translation);
      if (errors.length) {
        return errors;
      }
    }

    const task = await this.tasks.create({
      name,
      categoryName,
    });

    await this.tasks.createI18n(this.i18n.createTranslations(translations, { taskId: task.id }));

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<TaskDetailedDto> {
    const task = await this.tasks.getOneAdmin(id);
    if (!task) {
      throw createError(i18n, 'get', 'tasks.notFound');
    }

    return this.tasksMapper.toTaskDetailedDto(i18n, task);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { name, translations }: TaskEditReqDto,
  ): Promise<OkDto | TaskErrorDto[]> {
    const task = await this.tasks.getOne({ where: { id } });
    if (!task) {
      throw createError(i18n, 'edit', 'tasks.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const taskUpdate: Partial<GetRequired<ITask>> = {};

    if (name !== task.name) {
      taskUpdate.name = name;
    }

    for (const translation of translations) {
      const errors = await this.validateContent(i18n, task.categoryName, translation);
      if (errors.length) {
        return errors;
      }
    }

    if (Object.keys(taskUpdate).length) {
      await this.tasks.update(taskUpdate, { where: { id } });
    }

    await this.tasks.destroyI18n({ where: { taskId: id } });

    await this.tasks.createI18n(this.i18n.createTranslations(translations, { taskId: id }));

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const { linked } = await this.getOne(i18n, id);
    if (linked.length) {
      throw createError(i18n, 'delete', 'tasks.linked');
    }

    if ((await this.tasks.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'tasks.notFound');
    }
    return new OkDto();
  }
}
