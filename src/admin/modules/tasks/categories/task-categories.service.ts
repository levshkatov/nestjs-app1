import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { taskCategoryOrders } from '../../../../orm/modules/tasks/categories/scopes/task-category.scopes';
import { TaskCategoryOrmService } from '../../../../orm/modules/tasks/categories/task-category-orm.service';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { omitNullProps } from '../../../../shared/helpers/omit-null-props.helper';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import {
  TaskCategoriesReqDto,
  TaskCategoryDto,
  TaskCategoryReqDto,
} from './dtos/task-category.dto';
import { TaskCategoriesMapper } from './task-categories.mapper';

@Injectable()
export class TaskCategoriesService {
  constructor(
    private taskCategories: TaskCategoryOrmService,
    private taskCategoriesMapper: TaskCategoriesMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { forExercises, forHabits }: TaskCategoriesReqDto,
  ): Promise<TaskCategoryDto[]> {
    return (
      await this.taskCategories.getAll(
        {
          where: omitNullProps({ forHabits, forExercises }),
          order: [
            ['name', 'ASC'],
            taskCategoryOrders.taskTypesName,
            taskCategoryOrders.taskTypesIncludeIndex,
            taskCategoryOrders.taskTypesIncludeName,
          ],
        },
        ['taskTypes'],
      )
    ).map((taskCategory) => this.taskCategoriesMapper.toTaskCategoryDto(i18n, taskCategory));
  }

  async getAllSimple(i18n: I18nContext): Promise<ObjectSimpleDto[]> {
    return (await this.taskCategories.getAll({ order: [['name', 'ASC']] })).map((taskCategory) =>
      this.taskCategoriesMapper.toTaskCategorySimpleDto(taskCategory),
    );
  }

  async getOne(i18n: I18nContext, { name }: TaskCategoryReqDto): Promise<TaskCategoryDto> {
    const taskCategory = await this.taskCategories.getOneFromAll(
      {
        where: { name },
        order: [
          ['name', 'ASC'],
          taskCategoryOrders.taskTypesName,
          taskCategoryOrders.taskTypesIncludeIndex,
          taskCategoryOrders.taskTypesIncludeName,
        ],
      },
      ['taskTypes'],
    );
    if (!taskCategory) {
      throw createError(i18n, 'get', 'tasks.taskCategoryNotFound');
    }

    return this.taskCategoriesMapper.toTaskCategoryDto(i18n, taskCategory);
  }
}
