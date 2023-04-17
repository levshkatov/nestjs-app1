import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  CelebrityScopesMap,
  ICelebrity,
} from '../../orm/modules/celebrities/interfaces/celebrity.interface';
import { CourseScopesMap, ICourse } from '../../orm/modules/courses/interfaces/course.interface';
import {
  CourseStepScopesMap,
  ICourseStep,
} from '../../orm/modules/courses/steps/interfaces/course-step.interface';
import {
  ExerciseScopesMap,
  IExercise,
} from '../../orm/modules/exercises/interfaces/exercise.interface';
import {
  ExerciseTaskScopesMap,
  IExerciseTask,
} from '../../orm/modules/exercises/tasks/interfaces/exercise-task.interface';
import { IHabitCategoryI18n } from '../../orm/modules/habits/categories/interfaces/habit-category-i18n.interface';
import {
  HabitCategoryScopesMap,
  IHabitCategory,
} from '../../orm/modules/habits/categories/interfaces/habit-category.interface';
import { HabitScopesMap, IHabit } from '../../orm/modules/habits/interfaces/habit.interface';
import {
  IInterestingArticle,
  InterestingArticleScopesMap,
} from '../../orm/modules/interesting/articles/interfaces/interesting-article.interface';
import {
  IInterestingCategory,
  InterestingCategoryScopesMap,
} from '../../orm/modules/interesting/categories/interfaces/interesting-category.interface';
import {
  IInterestingChecklist,
  InterestingChecklistScopesMap,
} from '../../orm/modules/interesting/checklists/interfaces/interesting-checklist.interface';
import { IInterestingCoaching } from '../../orm/modules/interesting/coachings/interfaces/interesting-coaching.interface';
import { ILetter, LetterScopesMap } from '../../orm/modules/letters/interfaces/letter.interface';
import { ITask } from '../../orm/modules/tasks/interfaces/task.interface';
import { BS } from '../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../shared/modules/i18n/i18n-helper.service';
import { ObjectLinkedDto } from '../shared/dtos/object-linked.dto';
import { objectLinkedMap } from '../shared/interfaces/object-linked-map.constants';

@Injectable()
export class LinkedObjectsMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }

  toArticleLinkedDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IInterestingArticle, InterestingArticleScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'title');
    const { type, text, url } = objectLinkedMap.article;
    return {
      type,
      text: text(i18nContext, `№${id} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toCelebrityLinkedDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<ICelebrity, CelebrityScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'name');
    const { type, text, url } = objectLinkedMap.celebrity;
    return {
      type,
      text: text(i18nContext, `№${id} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toChecklistLinkedDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IInterestingChecklist, InterestingChecklistScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'title');
    const { type, text, url } = objectLinkedMap.checklist;
    return {
      type,
      text: text(i18nContext, `№${id} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toCoachingLinkedDto(
    i18nContext: I18nContext,
    { id }: IInterestingCoaching,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const { type, text, url } = objectLinkedMap.coaching;
    return {
      type,
      text: text(i18nContext, `№${id}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name: '',
      },
    };
  }

  toCourseLinkedDto(
    i18nContext: I18nContext,
    { id, i18n, type: courseType }: BS<ICourse, CourseScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'name');
    const { type, text, url } = objectLinkedMap.course;
    return {
      type,
      text: text(i18nContext, `№${id} - ${courseType} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toCourseStepLinkedDto(
    i18nContext: I18nContext,
    {
      course: { id, i18n: i18nCourse },
      i18n: i18nCourseStep,
      index,
    }: BS<ICourseStep, CourseStepScopesMap, 'i18n' | 'course'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const courseName = this.i18n.getValue(i18nContext, i18nCourse, 'name');
    const courseText = objectLinkedMap.course.text(i18nContext, `№${id} - ${courseName}`, true);

    const { type, text, url } = objectLinkedMap.courseStep;
    const courseStepName = this.i18n.getValue(i18nContext, i18nCourseStep, 'name');
    const courseStepText = includeTitle
      ? `${courseText}. ${text(i18nContext, `№${index} - ${courseStepName}`, true)}`
      : `№${index} - ${courseStepName}`;

    return {
      type,
      text: courseStepText,
      url: url(id, index),
      simple: {
        id: 0,
        name: courseStepName,
      },
    };
  }

  toExerciseLinkedDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IExercise, ExerciseScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'name');
    const { type, text, url } = objectLinkedMap.exercise;
    return {
      type,
      text: text(i18nContext, `№${id} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toHabitLinkedDto(
    i18nContext: I18nContext,
    dto: BS<IHabit, HabitScopesMap, 'i18n' | 'category'> | BS<IHabit, HabitScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const { id, i18n: i18nHabit } = dto;

    let i18nCategory: IHabitCategoryI18n[] | null = null;
    if ('category' in dto) {
      i18nCategory = dto.category.i18n;
    }

    const categoryName = i18nCategory
      ? `${this.i18n.getValue(i18nContext, i18nCategory, 'name')} - `
      : '';
    const habitName = this.i18n.getValue(i18nContext, i18nHabit, 'name');

    const { type, text, url } = objectLinkedMap.habit;
    return {
      type,
      text: text(i18nContext, `№${id} - ${categoryName}${habitName}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name: habitName,
      },
    };
  }

  toHabitCategoryLinkedDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IHabitCategory, HabitCategoryScopesMap, 'i18n' | 'photo'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'name');
    const { type, text, url } = objectLinkedMap.habitCategory;
    return {
      type,
      text: text(i18nContext, `№${id} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toInterestingCategoryLinkedDto(
    i18nContext: I18nContext,
    {
      id,
      type: categoryType,
      i18n,
    }: BS<IInterestingCategory, InterestingCategoryScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'title');
    const { type, text, url } = objectLinkedMap.interestingCategory;
    return {
      type,
      text: text(i18nContext, `№${id} - ${categoryType} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toLetterLinkedDto(
    i18nContext: I18nContext,
    { id, i18n, trigger }: BS<ILetter, LetterScopesMap, 'i18n'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const name = this.i18n.getValue(i18nContext, i18n, 'name');
    const { type, text, url } = objectLinkedMap.letter;
    return {
      type,
      text: text(i18nContext, `№${id} - ${trigger} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toTaskLinkedDto(
    i18nContext: I18nContext,
    { id, categoryName, name }: ITask,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const { type, text, url } = objectLinkedMap.task;
    return {
      type,
      text: text(i18nContext, `№${id} - ${categoryName} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }

  toExerciseTaskLinkedDto(
    i18nContext: I18nContext,
    { index, task: { id, categoryName, name } }: BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>,
    includeTitle: boolean,
  ): ObjectLinkedDto {
    const { type, text, url } = objectLinkedMap.task;
    return {
      type,
      text: text(i18nContext, `${index}. №${id} - ${categoryName} - ${name}`, includeTitle),
      url: url(id),
      simple: {
        id,
        name,
      },
    };
  }
}
