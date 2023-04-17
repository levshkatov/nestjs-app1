import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IHabitI18n } from '../../../orm/modules/habits/interfaces/habit-i18n.interface';
import { HabitScopesMap, IHabit } from '../../../orm/modules/habits/interfaces/habit.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { nullToUndefined } from '../../../shared/helpers/null-to-undefined.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { ObjectLinkedDto } from '../../shared/dtos/object-linked.dto';
import { ObjectSimpleDto } from '../../shared/dtos/object-simple.dto';
import { LinkedObjectsMapper } from '../linked-objects.mapper';
import { HabitDetailedDto, HabitForListDto, HabitI18nDto } from './dtos/habit.dto';

@Injectable()
export class HabitsMapper {
  constructor(private i18n: I18nHelperService, private linkedMapper: LinkedObjectsMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toHabitSimpleDto(
    i18nContext: I18nContext,
    { id, i18n }: BS<IHabit, HabitScopesMap, 'i18n'>,
  ): ObjectSimpleDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
    };
  }

  toHabitForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      task,
      daypart,
      time,
      i18n,
      category,
      tag,
    }: BS<IHabit, HabitScopesMap, 'category' | 'i18nSearch' | 'taskSearch'>,
  ): HabitForListDto {
    return {
      id,
      disabled,
      category: this.linkedMapper.toHabitCategoryLinkedDto(i18nContext, category, false),
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      daypart,
      time,
      tag: nullToUndefined(tag),
    };
  }

  toHabitDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      category,
      task,
      i18n,
      daypart,
      time,
      celebrityHabits,
      courseHabits,
      tag,
    }: BS<
      IHabit,
      HabitScopesMap,
      'category' | 'i18n' | 'task' | 'celebrityHabits' | 'courseHabits'
    >,
    disclaimer?: string,
  ): HabitDetailedDto {
    const linked: ObjectLinkedDto[] = [];

    linked.push(
      ...celebrityHabits.map(({ celebrity }) =>
        this.linkedMapper.toCelebrityLinkedDto(i18nContext, celebrity, true),
      ),
    );
    linked.push(
      ...courseHabits.map(({ course }) =>
        this.linkedMapper.toCourseLinkedDto(i18nContext, course, true),
      ),
    );

    return {
      disclaimer,
      id,
      disabled,
      category: this.linkedMapper.toHabitCategoryLinkedDto(i18nContext, category, false),
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
      daypart,
      time,
      translations: i18n.map((el) => this.toHabitI18nDto(i18nContext, el)),
      linked,
      tag: nullToUndefined(tag),
    };
  }

  toHabitI18nDto(
    i18nContext: I18nContext,
    { lang, name, description, daypartDescription, goal, forWhom }: IHabitI18n,
  ): HabitI18nDto {
    return {
      lang,
      name,
      description,
      daypartDescription,
      goal,
      forWhom,
    };
  }
}
