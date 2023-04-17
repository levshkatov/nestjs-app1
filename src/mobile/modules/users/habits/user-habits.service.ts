import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { UserHabitDataReqDto, UserHabitDto } from './dtos/user-habit.dto';
import { HABITS_SAVE_DATA_TYPES } from './interfaces/user-habits.constants';
import { UserHabitsMapper } from './user-habits.mapper';
import * as moment from 'moment';
import { Op } from 'sequelize';
import { TaskWithHabitIdDto } from '../../tasks/dtos/task.dto';
import { TasksMapper } from '../../tasks/tasks.mapper';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { UserOrmService } from '../../../../orm/modules/users/user-orm.service';
import { UserHabitDataOrmService } from '../../../../orm/modules/users/habit-datas/user-habit-data-orm.service';
import { UserHabitOrmService } from '../../../../orm/modules/users/habits/user-habit-orm.service';
import { HabitOrmService } from '../../../../orm/modules/habits/habit-orm.service';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { TaskCategoryName } from '../../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { userOrders } from '../../../../orm/modules/users/scopes/user.scopes';

@Injectable()
export class UserHabitsService {
  constructor(
    private popup: PopUpService,
    private habits: HabitOrmService,
    private users: UserOrmService,
    private userHabits: UserHabitOrmService,
    private userHabitsMapper: UserHabitsMapper,
    private userHabitDatas: UserHabitDataOrmService,
    private tasksMapper: TasksMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext, { userId }: IJWTUser): Promise<UserHabitDto[]> {
    const user = await this.users.getOneType(
      { where: { id: userId }, order: [userOrders.habits] },
      'mobile',
      ['habits'],
    );
    if (!user) {
      throw this.popup.error(i18n, `users.notFound`);
    }

    return user.habits.map((userHabit) => this.userHabitsMapper.toUserHabitDto(i18n, userHabit));
  }

  async getSavedData(
    i18n: I18nContext,
    notesId: number,
    { userId }: IJWTUser,
  ): Promise<TaskWithHabitIdDto> {
    const userHabitData = await this.userHabitDatas.getOne({
      where: {
        id: notesId,
        userId,
      },
    });
    if (!userHabitData) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    const { habitId, content } = userHabitData;

    const habit = await this.habits.getOneFromAll({ where: { id: habitId } }, ['task']);
    if (!habit) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    return this.tasksMapper.toTaskWithHabitIdDto(i18n, habit.task, habitId, content);
  }

  async saveData(
    i18n: I18nContext,
    habitId: number,
    { content }: UserHabitDataReqDto,
    { userId, offsetUTC: userOffsetUTC }: IJWTUser,
  ): Promise<OkDto> {
    const habit = await this.habits.getOneFromAll({ where: { id: habitId } }, ['task']);
    if (!habit) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    const userHabit = await this.userHabits.getOne({ where: { userId, habitId } });
    if (!userHabit) {
      throw this.popup.error(i18n, `habits.userHabitNotFound`);
    }

    if (!HABITS_SAVE_DATA_TYPES.includes(habit.task.categoryName)) {
      throw this.popup.error(i18n, `habits.notSaveData`);
    }

    // TODO validate content

    const offsetUTC = userOffsetUTC.split(':').map((el) => +el);

    const todayMidnight = moment
      .utc()
      .add({ hours: offsetUTC[0], minutes: offsetUTC[1] })
      .set({ hours: 0, minutes: 0, seconds: 0 })
      .toDate();

    const createdAt =
      habit.task.categoryName === TaskCategoryName.notes
        ? { [Op.gte]: todayMidnight }
        : { [Op.ne]: null };

    // TODO придумать update вместо destroy+create

    await this.userHabitDatas.destroy({ where: { userId, habitId, createdAt } });

    await this.userHabitDatas.create(
      {
        userId,
        habitId,
        content,
        createdAt: moment.utc().add({ hours: offsetUTC[0], minutes: offsetUTC[1] }).toDate(),
      },
      { raw: true },
    );

    return new OkDto();
  }
}
