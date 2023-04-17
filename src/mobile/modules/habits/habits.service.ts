import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../pop-up/pop-up.service';
import { HabitsMapper } from './habits.mapper';
import { HabitDetailedDto, HabitForListDto, HabitSetTimeDto, HabitsReqDto } from './dtos/habit.dto';
import { TaskWithHabitIdDto } from '../tasks/dtos/task.dto';
import { Op, Sequelize } from 'sequelize';
import { CHALLENGE_DURATION, MAX_ADDED_HABITS } from './interfaces/habit.constants';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { TasksMapper } from '../tasks/tasks.mapper';
import { TaskFinishDto } from '../../shared/dtos/task-finish.dto';
import { TaskFinishScreen } from '../../shared/interfaces/task-finish-screen.enum';
import { HABITS_SAVE_DATA_TYPES } from '../users/habits/interfaces/user-habits.constants';
import * as moment from 'moment';
import { LotusDto } from '../lotus/dtos/lotus.dto';
import { LotusState } from '../lotus/interfaces/lotus-state.enum';
import {
  HABIT_CATEGORY_BALANCE_DELIMITER,
  MAX_HABIT_CATEGORY_BALANCE,
} from '../users/balances/interfaces/user-balances.constants';
import { HabitCategoryBalancesMapper } from './categories/balances/habit-category-balances.mapper';
import { HabitOrmService } from '../../../orm/modules/habits/habit-orm.service';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { HabitScopesMap, IHabit } from '../../../orm/modules/habits/interfaces/habit.interface';
import { UserHabitOrmService } from '../../../orm/modules/users/habits/user-habit-orm.service';
import { omitNullProps } from '../../../shared/helpers/omit-null-props.helper';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { IUserHabit } from '../../../orm/modules/users/habits/interfaces/user-habit.interface';
import { TaskCategoryName } from '../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { UserHabitDataOrmService } from '../../../orm/modules/users/habit-datas/user-habit-data-orm.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { UserProfileOrmService } from '../../../orm/modules/users/profiles/user-profile-orm.service';
import { LotusOrmService } from '../../../orm/modules/lotuses/lotus-orm.service';
import { UserBalanceOrmService } from '../../../orm/modules/users/balances/user-balance-orm.service';
import { HabitCategoryBalanceOrmService } from '../../../orm/modules/habits/categories/balances/habit-category-balance-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { DAYPART_BOUNDARIES } from '../../../orm/modules/habits/interfaces/habit-daypart.enum';
import { LEVEL_DURATION } from '../levels/interfaces/level.constants';
import { LevelsService } from '../levels/levels.service';
import { TreesService } from '../trees/trees.service';
import { TREE_DURATION } from '../trees/interfaces/tree.constants';

@Injectable()
export class HabitsService {
  constructor(
    private popup: PopUpService,
    private habits: HabitOrmService,
    private habitsMapper: HabitsMapper,
    private userHabits: UserHabitOrmService,
    private tasksMapper: TasksMapper,
    private userHabitDatas: UserHabitDataOrmService,
    private lotus: LotusOrmService,
    private users: UserOrmService,
    private userProfiles: UserProfileOrmService,
    private userBalances: UserBalanceOrmService,
    private balances: HabitCategoryBalanceOrmService,
    private balancesMapper: HabitCategoryBalancesMapper,
    private trees: TreesService,
    private levels: LevelsService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { categoryId, randomOne }: HabitsReqDto,
    user?: IJWTUser,
  ): Promise<HabitForListDto[] | HabitDetailedDto[]> {
    const userHabitIds = user
      ? (await this.userHabits.getAll({ where: { userId: user.userId } })).map(
          ({ habitId }) => habitId,
        )
      : [];

    if (!randomOne) {
      // order: [['daypart', 'ASC']];
      return (
        await this.habits.getAll({ where: { ...omitNullProps({ categoryId }), disabled: false } }, [
          'i18n',
          'category',
        ])
      )
        .map((habit) =>
          this.habitsMapper.toHabitForListDto(
            i18n,
            habit,
            userHabitIds.length ? userHabitIds.includes(habit.id) : undefined,
          ),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    const habit = await this.habits.getOneFromAll(
      {
        where: {
          ...omitNullProps({ categoryId }),
          id: {
            [Op.notIn]: userHabitIds,
          },
          disabled: false,
        },
        order: [Sequelize.fn('RANDOM')],
      },
      ['i18n', 'category'],
    );
    if (!habit) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    return [this.habitsMapper.toHabitDetailedDto(i18n, habit, false)];
  }

  async getOne(
    i18n: I18nContext,
    { id, tag }: { id?: number; tag?: string },
    user?: IJWTUser,
  ): Promise<HabitDetailedDto> {
    if (!id && !tag) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    const habit = await this.habits.getOneFromAll(
      {
        where: { ...omitNullProps({ id, tag }), disabled: false },
      },
      ['i18n', 'category'],
    );
    if (!habit) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    const userHabitIds = user
      ? (await this.userHabits.getAll({ where: { userId: user.userId } })).map(
          ({ habitId }) => habitId,
        )
      : [];

    return this.habitsMapper.toHabitDetailedDto(
      i18n,
      habit,
      userHabitIds.length ? userHabitIds.includes(habit.id) : undefined,
    );
  }

  async add(
    i18n: I18nContext,
    habitId: number,
    { userId }: IJWTUser,
    { isChallenge, forceChangeChallenge }: { isChallenge: boolean; forceChangeChallenge?: boolean },
  ): Promise<PopUpDto> {
    const { time } = await this.getHabit(i18n, habitId);
    const userHabits = await this.userHabits.getAll({
      where: { userId },
    });

    if (userHabits.find(({ habitId: userHabitId }) => userHabitId === habitId)) {
      throw this.popup.error(i18n, `habits.yetAdded`);
    }

    if (isChallenge) {
      const userHabit = userHabits.find(({ isChallenge }) => isChallenge);
      if (userHabit) {
        if (!forceChangeChallenge) {
          throw this.popup.question(i18n, `habits.changeChallenge`);
        } else {
          await this.userHabits.update(
            { habitId },
            { where: { userId, habitId: userHabit.habitId } },
          );
          throw this.popup.ok(i18n, `habits.addedChallenge`);
        }
      }
    } else {
      if (
        userHabits.filter(
          ({ isChallenge, fromCelebrities, fromCourses }) =>
            !isChallenge && !fromCelebrities && !fromCourses,
        ).length >= MAX_ADDED_HABITS
      ) {
        throw this.popup.error(i18n, `habits.tooMany`);
      }
    }

    await this.userHabits.create({
      userId,
      habitId,
      time,
      isCompleted: false,
      isChallenge,
      daysRemaining: isChallenge ? CHALLENGE_DURATION : 0,
      fromCourses: false,
      fromCelebrities: false,
    });

    throw this.popup.ok(i18n, `habits.${isChallenge ? `addedChallenge` : `added`}`);
  }

  async remove(i18n: I18nContext, habitId: number, { userId }: IJWTUser): Promise<PopUpDto> {
    const { task } = await this.getHabit(i18n, habitId);
    const { isChallenge } = await this.getUserHabit(i18n, userId, habitId);

    await this.userHabits.destroy({ where: { userId, habitId } });

    if (
      HABITS_SAVE_DATA_TYPES.includes(task.categoryName) &&
      task.categoryName !== TaskCategoryName.notes
    ) {
      await this.userHabitDatas.destroy({ where: { userId, habitId } });
    }

    throw this.popup.ok(i18n, `habits.${isChallenge ? `removedChallenge` : `removed`}`);
  }

  async start(
    i18n: I18nContext,
    habitId: number,
    { userId, offsetUTC: userOffsetUTC }: IJWTUser,
  ): Promise<TaskWithHabitIdDto> {
    const { task } = await this.getHabit(i18n, habitId);
    const { isCompleted, isChallenge } = await this.getUserHabit(i18n, userId, habitId);

    if (isCompleted) {
      throw this.popup.error(
        i18n,
        `habits.${isChallenge ? `yetCompletedChallenge` : `yetCompleted`}`,
      );
    }

    if (HABITS_SAVE_DATA_TYPES.includes(task.categoryName)) {
      const offsetUTC = userOffsetUTC.split(':').map((el) => +el);
      const todayMidnight = moment
        .utc()
        .add({ hours: offsetUTC[0], minutes: offsetUTC[1] })
        .set({ hours: 0, minutes: 0, seconds: 0 })
        .toDate();
      const tomorrowMidnight = moment
        .utc()
        .add({ days: 1, hours: offsetUTC[0], minutes: offsetUTC[1] })
        .set({ hours: 0, minutes: 0, seconds: 0 })
        .toDate();

      const createdAt = {
        [Op.and]: {
          [Op.gte]: todayMidnight,
          [Op.lt]: tomorrowMidnight,
        },
      };

      const userHabitData = await this.userHabitDatas.getOne({
        where: {
          userId,
          habitId,
          createdAt,
        },
      });

      if (userHabitData) {
        return this.tasksMapper.toTaskWithHabitIdDto(i18n, task, habitId, userHabitData.content);
      }
    }

    return this.tasksMapper.toTaskWithHabitIdDto(i18n, task, habitId);
  }

  async finish(i18n: I18nContext, habitId: number, { userId }: IJWTUser): Promise<TaskFinishDto> {
    const user = await this.users.getOne({ where: { id: userId } }, ['profile']);
    if (!user) {
      throw this.popup.error(i18n, `e.commonError`);
    }
    let totalTasks = user.profile.totalTasks;

    const { task, daypart, categoryId } = await this.getHabit(i18n, habitId);
    const { isCompleted, isChallenge, daysRemaining } = await this.getUserHabit(
      i18n,
      userId,
      habitId,
    );

    const taskFinish: TaskFinishDto = { screenType: TaskFinishScreen.finishHabitTask };

    if (isCompleted) {
      throw this.popup.error(
        i18n,
        `habits.${isChallenge ? `yetCompletedChallenge` : `yetCompleted`}`,
      );
    }

    const userHabitUpdate: Partial<IUserHabit> = { isCompleted: true };

    const oldLevelI = Math.floor(totalTasks / LEVEL_DURATION) + 1;
    totalTasks++;
    const newLevelI = Math.floor(totalTasks / LEVEL_DURATION) + 1;
    taskFinish.newLevel =
      newLevelI !== oldLevelI ? await this.levels.get(i18n, totalTasks) : undefined;

    await this.userProfiles.update({ totalTasks }, { where: { userId } });

    if (isChallenge) {
      if (daysRemaining <= 1) {
        await this.userHabits.destroy({ where: { userId, habitId } });
        taskFinish.screenType = TaskFinishScreen.completeChallenge;
        return taskFinish;
      }

      userHabitUpdate.daysRemaining = daysRemaining - 1;
      taskFinish.screenType = TaskFinishScreen.finishChallenge;
    }

    if (totalTasks % TREE_DURATION === 0) {
      taskFinish.screenType = TaskFinishScreen.finish10thTask;
      taskFinish.newTree = await this.trees.get(i18n, totalTasks);
    }

    await this.userHabits.update(userHabitUpdate, {
      where: { userId, habitId },
    });

    if (
      HABITS_SAVE_DATA_TYPES.includes(task.categoryName) &&
      task.categoryName !== TaskCategoryName.notes
    ) {
      await this.userHabitDatas.destroy({ where: { userId, habitId } });
    }

    if (!isChallenge) {
      await this.lotus.add(userId, daypart);

      const lotus = new LotusDto();
      const lotusParts = await this.lotus.getAllParts(userId);
      lotusParts.forEach(
        ({ daypart }, i) =>
          (lotus[daypart] = i === lotusParts.length - 1 ? LotusState.filling : LotusState.full),
      );

      taskFinish.lotus = lotus;
    }

    const userBalance = await this.userBalances.getOne({
      where: { userId, habitCategoryBalanceId: categoryId },
    });

    if (!userBalance) {
      await this.userBalances.create({
        userId,
        habitCategoryBalanceId: categoryId,
        total: 1,
        isCompleted: false,
      });
    } else {
      const total = userBalance.isCompleted ? userBalance.total : userBalance.total + 1;
      const isCompleted =
        Math.floor(total / HABIT_CATEGORY_BALANCE_DELIMITER) === MAX_HABIT_CATEGORY_BALANCE;
      await this.userBalances.update(
        { total, isCompleted },
        { where: { userId, habitCategoryBalanceId: categoryId } },
      );

      if (!userBalance.isCompleted && isCompleted) {
        const balance = await this.balances.getOneFromAll(
          { where: { habitCategoryId: categoryId } },
          ['i18n', 'photo'],
        );
        if (!balance) {
          return taskFinish;
        }
        taskFinish.newBalance = this.balancesMapper.toHabitCategoryBalanceNewDto(i18n, balance);
      }
    }

    return taskFinish;
  }

  async setTime(
    i18n: I18nContext,
    habitId: number,
    { userId }: IJWTUser,
    { time }: HabitSetTimeDto,
  ): Promise<PopUpDto> {
    const { daypart } = await this.getHabit(i18n, habitId);
    const {} = await this.getUserHabit(i18n, userId, habitId);
    time = `${time.slice(0, -2)}00`;

    if (time < DAYPART_BOUNDARIES[daypart][0] || time > DAYPART_BOUNDARIES[daypart][1]) {
      throw this.popup.error(i18n, `habits.timeNotInBoundaries`);
    }

    await this.userHabits.update({ time }, { where: { userId, habitId } });

    throw this.popup.ok(i18n, `habits.timeChanged`);
  }

  async getHabit(
    i18n: I18nContext,
    id: number,
  ): Promise<BS<IHabit, HabitScopesMap, 'i18n' | 'category' | 'task'>> {
    if (!id) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    const habit = await this.habits.getOneFromAll({ where: { id, disabled: false } }, [
      'i18n',
      'category',
      'task',
    ]);
    if (!habit) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    return habit;
  }

  async getUserHabit(i18n: I18nContext, userId: number, habitId: number): Promise<IUserHabit> {
    if (!userId || !habitId) {
      throw this.popup.error(i18n, `habits.notFound`);
    }

    const userHabit = await this.userHabits.getOne({
      where: { userId, habitId },
    });
    if (!userHabit) {
      throw this.popup.error(i18n, `habits.userHabitNotFound`);
    }

    return userHabit;
  }
}
