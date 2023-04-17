import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ITaskCategoryType } from '../../../../orm/modules/tasks/categories/interfaces/task-category-type.interface';
import { ITaskTypeInclude } from '../../../../orm/modules/tasks/types/interfaces/task-type-include.interface';
import {
  ITaskType,
  TaskTypeScopesMap,
} from '../../../../orm/modules/tasks/types/interfaces/task-type.interface';
import { BS, ThroughR } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { TaskTypeDetailedDto, TaskTypeDto, TaskTypeIncludeDto } from './dtos/task-type.dto';

@Injectable()
export class TaskTypesMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }

  toTaskTypeDto(
    i18nContext: I18nContext,
    {
      name,
      description,
      dataDescription,
      dataDefault,
      dataRequired,
      files,
      include,
    }: BS<ITaskType, TaskTypeScopesMap, 'include'>,
  ): TaskTypeDto {
    return {
      name,
      description,
      dataDescription: nullToUndefined(dataDescription),
      dataDefault: nullToUndefined(dataDefault),
      dataRequired,
      files: nullToUndefined(files),
      include: include.map((el) => this.toTaskTypeIncludeDto(i18nContext, el)),
    };
  }

  toTaskTypeIncludeDto(
    i18nContext: I18nContext,
    {
      name,
      description,
      dataDescription,
      dataDefault,
      dataRequired,
      files,
      TaskTypeInclude: { required, maxElements, taskTypesExcluded },
    }: ITaskType & ThroughR<'TaskTypeInclude', ITaskTypeInclude>,
  ): TaskTypeIncludeDto {
    return {
      name,
      description,
      dataDescription: nullToUndefined(dataDescription),
      dataDefault: nullToUndefined(dataDefault),
      dataRequired,
      files: nullToUndefined(files),
      maxElements,
      required,
      taskTypesExcluded: nullToUndefined(taskTypesExcluded),
    };
  }

  toTaskTypeDetailedDto(
    i18nContext: I18nContext,
    {
      name,
      description,
      dataDescription,
      dataDefault,
      dataRequired,
      files,
      TaskCategoryType: { required, maxElements, taskTypesExcluded },
      include,
    }: BS<ITaskType, TaskTypeScopesMap, 'include'> &
      ThroughR<'TaskCategoryType', ITaskCategoryType>,
  ): TaskTypeDetailedDto {
    return {
      name,
      description,
      dataDescription: nullToUndefined(dataDescription),
      dataDefault: nullToUndefined(dataDefault),
      dataRequired,
      files: nullToUndefined(files),
      required,
      maxElements,
      taskTypesExcluded: nullToUndefined(taskTypesExcluded),
      include: include.map((el) => this.toTaskTypeIncludeDto(i18nContext, el)),
    };
  }
}
