import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IExerciseTask,
  ExerciseTaskScopesMap,
} from '../../../orm/modules/exercises/tasks/interfaces/exercise-task.interface';
import { HabitScopesMap, IHabit } from '../../../orm/modules/habits/interfaces/habit.interface';
import {
  IInterestingArticle,
  InterestingArticleScopesMap,
} from '../../../orm/modules/interesting/articles/interfaces/interesting-article.interface';
import {
  IInterestingChecklist,
  InterestingChecklistScopesMap,
} from '../../../orm/modules/interesting/checklists/interfaces/interesting-checklist.interface';
import { ITaskI18n } from '../../../orm/modules/tasks/interfaces/task-i18n.interface';
import { ITask, TaskScopesMap } from '../../../orm/modules/tasks/interfaces/task.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { ObjectLinkedDto } from '../../shared/dtos/object-linked.dto';
import { LinkedObjectsMapper } from '../linked-objects.mapper';
import { TaskDetailedDto, TaskForListDto, TaskI18nDto } from './dtos/task.dto';

@Injectable()
export class TasksMapper {
  constructor(private i18n: I18nHelperService, private linkedMapper: LinkedObjectsMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toTaskForListDto(
    i18nContext: I18nContext,
    {
      id,
      name,
      categoryName,
      habits,
      exerciseTasks,
      interestingArticles,
      interestingChecklists,
      category: { forHabits, forExercises },
    }: BS<
      ITask,
      TaskScopesMap,
      'habits' | 'exerciseTasks' | 'interestingArticles' | 'interestingChecklists' | 'category'
    >,
  ): TaskForListDto {
    return {
      id,
      name,
      categoryName,
      forHabits,
      forExercises,
      linked: this.createLinked(
        i18nContext,
        habits,
        exerciseTasks,
        interestingArticles,
        interestingChecklists,
      ),
    };
  }

  toTaskDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      name,
      categoryName,
      i18n,
      habits,
      exerciseTasks,
      interestingArticles,
      interestingChecklists,
      category: { forHabits, forExercises },
    }: BS<
      ITask,
      TaskScopesMap,
      | 'i18n'
      | 'habits'
      | 'exerciseTasks'
      | 'interestingArticles'
      | 'interestingChecklists'
      | 'category'
    >,
    disclaimer?: string,
  ): TaskDetailedDto {
    return {
      disclaimer,
      id,
      name,
      categoryName,
      forHabits,
      forExercises,
      linked: this.createLinked(
        i18nContext,
        habits,
        exerciseTasks,
        interestingArticles,
        interestingChecklists,
      ),
      translations: i18n.map((el) => this.toTaskI18nDto(i18nContext, el)),
    };
  }

  toTaskI18nDto(i18nContext: I18nContext, { lang, content }: ITaskI18n): TaskI18nDto {
    return {
      lang,
      content,
    };
  }

  createLinked(
    i18nContext: I18nContext,
    habits: BS<IHabit, HabitScopesMap, 'i18n'>[],
    exerciseTasks: BS<IExerciseTask, ExerciseTaskScopesMap, 'exercise'>[],
    interestingArticles: BS<IInterestingArticle, InterestingArticleScopesMap, 'i18n'>[],
    interestingChecklists: BS<IInterestingChecklist, InterestingChecklistScopesMap, 'i18n'>[],
  ): ObjectLinkedDto[] {
    const linked: ObjectLinkedDto[] = [];

    linked.push(
      ...habits.map((habit) => this.linkedMapper.toHabitLinkedDto(i18nContext, habit, true)),
    );
    linked.push(
      ...exerciseTasks.map(({ exercise }) =>
        this.linkedMapper.toExerciseLinkedDto(i18nContext, exercise, true),
      ),
    );
    linked.push(
      ...interestingArticles.map((article) =>
        this.linkedMapper.toArticleLinkedDto(i18nContext, article, true),
      ),
    );
    linked.push(
      ...interestingChecklists.map((checklist) =>
        this.linkedMapper.toChecklistLinkedDto(i18nContext, checklist, true),
      ),
    );

    return linked;
  }
}
