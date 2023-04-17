import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IExerciseTask,
  ExerciseTaskScopesMap,
} from '../../../../orm/modules/exercises/tasks/interfaces/exercise-task.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../../linked-objects.mapper';
import { ExerciseTaskDetailedDto, ExerciseTaskForListDto } from './dtos/exercise-task.dto';

@Injectable()
export class ExerciseTasksMapper {
  constructor(private i18n: I18nHelperService, private linkedMapper: LinkedObjectsMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toExerciseTaskForListDto(
    i18nContext: I18nContext,
    { index, task }: BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>,
  ): ExerciseTaskForListDto {
    return {
      index,
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
    };
  }

  toExerciseTaskDetailedDto(
    i18nContext: I18nContext,
    { index, task, taskId }: BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>,
    disclaimer?: string,
  ): ExerciseTaskDetailedDto {
    return {
      disclaimer,
      taskId,
      index,
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
    };
  }
}
