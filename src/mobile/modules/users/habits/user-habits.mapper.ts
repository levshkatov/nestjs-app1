import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { DAYPART_BOUNDARIES } from '../../../../orm/modules/habits/interfaces/habit-daypart.enum';
import { HabitScopesMap, IHabit } from '../../../../orm/modules/habits/interfaces/habit.interface';
import { TaskCategoryName } from '../../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { IUserHabit } from '../../../../orm/modules/users/habits/interfaces/user-habit.interface';
import { BS, ThroughR } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { UserHabitDto } from './dtos/user-habit.dto';

@Injectable()
export class UserHabitsMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toUserHabitDto(
    i18nContext: I18nContext,
    {
      id,
      category,
      i18n,
      daypart,
      task,
      UserHabit: { time, isCompleted, isChallenge, daysRemaining, fromCourses },
    }: BS<IHabit, HabitScopesMap, 'i18n' | 'category' | 'task'> & ThroughR<'UserHabit', IUserHabit>,
  ): UserHabitDto {
    return {
      id,
      time,
      daypart,
      daypartBoundaries: DAYPART_BOUNDARIES[daypart],
      isCompleted,
      isChallenge,
      daysRemaining,
      fromCourses,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, category.photo),
      isSimple: task.categoryName === TaskCategoryName.alpha,
    };
  }
}
