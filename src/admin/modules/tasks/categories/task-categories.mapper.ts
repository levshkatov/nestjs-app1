import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  ITaskCategory,
  TaskCategoryScopesMap,
} from '../../../../orm/modules/tasks/categories/interfaces/task-category.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import { TaskTypesMapper } from '../types/task-types.mapper';
import { TaskCategoryDto } from './dtos/task-category.dto';

@Injectable()
export class TaskCategoriesMapper {
  constructor(private i18n: I18nHelperService, private taskTypesMapper: TaskTypesMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toTaskCategorySimpleDto({ name }: ITaskCategory): ObjectSimpleDto {
    return {
      id: 0,
      name,
    };
  }

  toTaskCategoryDto(
    i18nContext: I18nContext,
    { name, taskTypes }: BS<ITaskCategory, TaskCategoryScopesMap, 'taskTypes'>,
  ): TaskCategoryDto {
    return {
      name,
      taskTypes: taskTypes.map((el) => this.taskTypesMapper.toTaskTypeDetailedDto(i18nContext, el)),
    };
  }
}
