import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { HabitCategoryOrmService } from '../../../orm/modules/habits/categories/habit-category-orm.service';
import { HabitOrmService } from '../../../orm/modules/habits/habit-orm.service';
import {
  DAYPART_BOUNDARIES,
  HabitDaypart,
} from '../../../orm/modules/habits/interfaces/habit-daypart.enum';
import { IHabit } from '../../../orm/modules/habits/interfaces/habit.interface';
import { NotificationType } from '../../../orm/modules/notifications/interfaces/notification-type.enum';
import { TaskCategoryName } from '../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { TaskOrmService } from '../../../orm/modules/tasks/task-orm.service';
import { UserHabitDataOrmService } from '../../../orm/modules/users/habit-datas/user-habit-data-orm.service';
import { UserHabitOrmService } from '../../../orm/modules/users/habits/user-habit-orm.service';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../shared/helpers/create-disclaimer.helper';
import { createError, ErrorTitle } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { NotificationsService } from '../../../shared/modules/notifications/notifications.service';
import { ObjectSimpleDto } from '../../shared/dtos/object-simple.dto';
import {
  HabitCreateReqDto,
  HabitDetailedDto,
  HabitEditReqDto,
  HabitsForListDto,
  HabitsReqDto,
  HabitsSimpleReqDto,
} from './dtos/habit.dto';
import { HabitsMapper } from './habits.mapper';

@Injectable()
export class HabitsService {
  constructor(
    private i18n: I18nHelperService,
    private habits: HabitOrmService,
    private habitsMapper: HabitsMapper,
    private categories: HabitCategoryOrmService,
    private tasks: TaskOrmService,
    private userHabits: UserHabitOrmService,
    private userHabitDatas: UserHabitDataOrmService,
    private notifications: NotificationsService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: HabitsReqDto,
  ): Promise<HabitsForListDto> {
    const { pages, total, habits } = await this.habits.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      habits: habits.map((habit) => this.habitsMapper.toHabitForListDto(i18n, habit)),
      disclaimer: createDisclaimer(i18n, 'habits.forbiddenIfUsed', 'habits.forbiddenIfHasLinked'),
    };
  }

  async create(
    i18n: I18nContext,
    { categoryId, daypart, taskId, time, translations, countdown, tag }: HabitCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.categories.getOne({ where: { id: categoryId } }))) {
      throw createError(i18n, 'create', 'habits.categoryNotFound');
    }

    await this.checkTask(i18n, 'create', taskId, countdown);

    time = this.checkTime(i18n, 'create', daypart, time);

    if (tag) {
      if (!!(await this.habits.getOne({ where: { tag } }))) {
        throw createError(i18n, 'create', 'habits.tagExisting');
      }
    }

    const habit = await this.habits.create({
      categoryId,
      daypart,
      disabled: true,
      taskId,
      time,
      countdown,
      tag,
    });

    await this.habits.createI18n(this.i18n.createTranslations(translations, { habitId: habit.id }));

    return new OkDto();
  }

  async getAllSimple(
    i18n: I18nContext,
    { disabled = false }: HabitsSimpleReqDto,
  ): Promise<ObjectSimpleDto[]> {
    return (
      await this.habits.getAll({ where: { disabled }, order: [['id', 'ASC']] }, ['i18n'])
    ).map((habit) => this.habitsMapper.toHabitSimpleDto(i18n, habit));
  }

  async getOne(i18n: I18nContext, id: number): Promise<HabitDetailedDto> {
    const habit = await this.habits.getOneFromAll({ where: { id } }, [
      'i18n',
      'task',
      'category',
      'celebrityHabits',
      'courseHabits',
    ]);
    if (!habit) {
      throw createError(i18n, 'get', 'habits.notFound');
    }

    const isUser = !!(await this.userHabits.getOne({ where: { habitId: id } }));
    const isUserData = !!(await this.userHabitDatas.getOne({ where: { habitId: id } }));
    const habitIsUsed = isUser || isUserData;
    const habitHasLinked = !!(habit.celebrityHabits.length || habit.courseHabits.length);

    return this.habitsMapper.toHabitDetailedDto(
      i18n,
      habit,
      habitIsUsed
        ? createDisclaimer(i18n, 'habits.isUsed', 'habits.forbiddenIfUsed')
        : habitHasLinked
        ? createDisclaimer(i18n, 'habits.forbiddenIfHasLinked')
        : undefined,
    );
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { categoryId, daypart, taskId, time, translations, countdown, disabled, tag }: HabitEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const habit = await this.habits.getOneFromAll({ where: { id } }, ['category', 'task']);
    if (!habit) {
      throw createError(i18n, 'edit', 'habits.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const habitUpdate: Partial<GetRequired<IHabit>> = {};

    if (categoryId !== habit.categoryId) {
      if (!(await this.categories.getOne({ where: { id: categoryId } }))) {
        throw createError(i18n, 'edit', 'habits.categoryNotFound');
      }
      habitUpdate.categoryId = categoryId;
    }

    if (taskId !== habit.taskId) {
      await this.checkTask(i18n, 'edit', taskId, countdown);
      habitUpdate.taskId = taskId;
    }

    if (time !== habit.time) {
      time = this.checkTime(i18n, 'edit', daypart, time);
      habitUpdate.time = time;
    }

    if (disabled !== undefined && disabled !== habit.disabled && role === UserRole.webAdmin) {
      if (disabled === true) {
        await this.checkLinked(i18n, 'edit', id);
      } else {
        this.notifications.sendToAllUsers(NotificationType.newHabit, id);
      }
      habitUpdate.disabled = disabled;
    }

    if (tag && tag !== habit.tag) {
      if (!!(await this.habits.getOne({ where: { tag } }))) {
        throw createError(i18n, 'edit', 'habits.tagExisting');
      }
      habitUpdate.tag = tag;
    }

    if (Object.keys(habitUpdate).length) {
      await this.habits.update(habitUpdate, { where: { id } });
    }

    await this.habits.destroyI18n({ where: { habitId: id } });
    await this.habits.createI18n(this.i18n.createTranslations(translations, { habitId: id }));

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    await this.checkLinked(i18n, 'delete', id);

    if ((await this.habits.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'habits.notFound');
    }

    return new OkDto();
  }

  private async checkLinked(i18n: I18nContext, errorTitle: ErrorTitle, id: number): Promise<void> {
    const habit = await this.habits.getOneFromAll({ where: { id } }, [
      'celebrityHabits',
      'courseHabits',
    ]);
    if (!habit) {
      throw createError(i18n, errorTitle, 'habits.notFound');
    }

    const errors: string[] = [];

    if (habit.celebrityHabits.length) {
      errors.push(
        i18n.t('errors.habits.habitHasCelebrities', {
          args: { id: habit.celebrityHabits.map(({ celebrityId }) => celebrityId).join(', ') },
        }),
      );
    }

    if (habit.courseHabits.length) {
      errors.push(
        i18n.t('errors.habits.habitHasCourses', {
          args: { id: habit.courseHabits.map(({ courseId }) => courseId).join(', ') },
        }),
      );
    }

    if (await this.userHabits.getOne({ where: { habitId: id } })) {
      errors.push(i18n.t('errors.habits.habitHasUsers'));
    }

    if (await this.userHabitDatas.getOne({ where: { habitId: id } })) {
      errors.push(i18n.t('errors.habits.habitHasUserDatas'));
    }

    if (errors.length) {
      throw createError(i18n, errorTitle, null, errors);
    }
  }

  private async checkTask(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    taskId: number,
    countdown?: string,
  ): Promise<void> {
    const task = await this.tasks.getOneFromAll({ where: { id: taskId } }, ['category']);
    if (!task) {
      throw createError(i18n, errorTitle, 'tasks.notFound');
    }
    if (!task.category.forHabits) {
      throw createError(i18n, errorTitle, 'tasks.notForHabits');
    }
    if (task.categoryName === TaskCategoryName.timer && !countdown) {
      throw createError(i18n, errorTitle, 'habits.noCountdown');
    }
  }

  private checkTime(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    daypart: HabitDaypart,
    time?: string,
  ): string {
    let retTime = time;

    if (!retTime) {
      retTime =
        daypart === HabitDaypart.morning
          ? '08:00'
          : daypart === HabitDaypart.day
          ? '14:00'
          : '20:00';
    }

    if (
      `${retTime}:00` < DAYPART_BOUNDARIES[daypart][0] ||
      `${retTime}:00` > DAYPART_BOUNDARIES[daypart][1]
    ) {
      throw createError(
        i18n,
        errorTitle,
        null,
        i18n.t('errors.habits.timeNotInBoundaries', {
          args: { boundaries: DAYPART_BOUNDARIES[daypart] },
        }),
      );
    }

    return retTime;
  }
}
