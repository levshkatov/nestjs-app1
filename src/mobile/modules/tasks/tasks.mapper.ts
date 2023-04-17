import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IExerciseTask,
  ExerciseTaskScopesMap,
} from '../../../orm/modules/exercises/tasks/interfaces/exercise-task.interface';
import { ITaskContent } from '../../../orm/modules/tasks/interfaces/task-i18n.interface';
import { ITask, TaskScopesMap } from '../../../orm/modules/tasks/interfaces/task.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { TaskForCoachingDto } from '../interesting/coachings/dtos/interesting-coaching.dto';
import { TaskForCourseDto } from '../users/courses/dtos/user-course-exercises.dto';
import { TaskDto, TaskWithHabitIdDto, TaskWithoutContentDto } from './dtos/task.dto';

@Injectable()
export class TasksMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }

  toTaskWithoutContentDto(
    i18nContext: I18nContext,
    { id, name, categoryName: category }: ITask,
  ): TaskWithoutContentDto {
    return {
      id,
      name,
      category,
    };
  }

  toTaskDto(
    i18nContext: I18nContext,
    { id, name, i18n, categoryName: category }: BS<ITask, TaskScopesMap, 'i18n'>,
  ): TaskDto {
    return {
      id,
      name,
      category,
      content: this.i18n.getValue(i18nContext, i18n, 'content', []),
    };
  }

  toTaskWithHabitIdDto(
    i18nContext: I18nContext,
    { id, categoryName: category, name, i18n }: BS<ITask, TaskScopesMap, 'i18n'>,
    habitId: number,
    changeContent?: ITaskContent[],
  ): TaskWithHabitIdDto {
    if (changeContent?.length) {
      return { id, category, name, content: changeContent, habitId };
    }

    return {
      id,
      category,
      name,
      content: this.i18n.getValue(i18nContext, i18n, 'content', []),
      habitId,
    };
  }

  toTaskForCourseDto(
    i18nContext: I18nContext,
    {
      index,
      task: { id, name, i18n, categoryName: category },
    }: BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>,
  ): TaskForCourseDto {
    return {
      id,
      category,
      name,
      content: this.i18n.getValue(i18nContext, i18n, 'content', []),
      index,
    };
  }

  toTaskForCoachingDto(
    i18nContext: I18nContext,
    {
      index,
      task: { id, name, i18n, categoryName: category },
    }: BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>,
  ): TaskForCoachingDto {
    return {
      id,
      category,
      name,
      content: this.i18n.getValue(i18nContext, i18n, 'content', []),
      index,
    };
  }
}
