import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { NotificationType } from '../../../orm/modules/notifications/interfaces/notification-type.enum';
import { AppleSubscriptionOrmService } from '../../../orm/modules/subscriptions/apple/apple-subscription-orm.service';
import { UserCourseOrmService } from '../../../orm/modules/users/courses/user-course-orm.service';
import { UserHabitOrmService } from '../../../orm/modules/users/habits/user-habit-orm.service';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { UserProfileOrmService } from '../../../orm/modules/users/profiles/user-profile-orm.service';
import { UserSessionOrmService } from '../../../orm/modules/users/sessions/user-session-orm.service';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { UserVerifyCodeOrmService } from '../../../orm/modules/users/verify-codes/user-verify-code-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { NotificationsService } from '../../../shared/modules/notifications/notifications.service';
import { SubscriptionType } from '../subscriptions/interfaces/subscription-type.enum';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class CronService {
  constructor(
    private verifyCodes: UserVerifyCodeOrmService,
    private sessions: UserSessionOrmService,
    private users: UserOrmService,
    private userProfiles: UserProfileOrmService,
    private userHabits: UserHabitOrmService,
    private userCourses: UserCourseOrmService,
    private notifications: NotificationsService,
    private appleSubscriptions: AppleSubscriptionOrmService,
    private subscriptions: SubscriptionsService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteOldData() {
    await this.verifyCodes.destroy({
      where: {
        expireAt: {
          [Op.lt]: Date.now(),
        },
      },
    });

    await this.sessions.destroy({
      where: {
        expireAt: {
          [Op.lt]: Date.now(),
        },
      },
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshHabits() {
    const usersInMidnight = await this.users.getAllByTimeWithHabits({ time: '00:00' });
    if (!usersInMidnight.length) return;

    await this.userHabits.update(
      { isCompleted: false },
      {
        where: {
          [Op.or]: usersInMidnight
            .filter(({ habits }) => habits && habits.length)
            .map(({ id: userId, habits }) => ({
              [Op.and]: {
                userId,
                habitId: habits.map(({ id }) => id),
              },
            })),
        },
      },
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshWaterBalance() {
    const usersInMidnight = await this.users.getAllByTime({ time: '00:00' });
    if (!usersInMidnight.length) return;

    await this.userProfiles.update(
      { waterBalance: 0 },
      { where: { userId: { [Op.in]: usersInMidnight.map(({ id }) => id) } } },
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshCourseProgress() {
    const usersInMidnight = await this.users.getAllByTimeWithCourses({ time: '00:00' });
    if (!usersInMidnight.length) return;

    await this.userCourses.update(
      { exercisesCompletedToday: 0 },
      {
        where: {
          [Op.or]: usersInMidnight
            .filter(({ courses }) => courses && courses.length)
            .map(({ id: userId, courses }) => ({
              [Op.and]: {
                userId,
                courseId: courses.map(({ id }) => id),
              },
            })),
        },
      },
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async habitStart() {
    const usersHabitStart = Object.entries(await this.users.getAllHabitStart());
    if (usersHabitStart.length) {
      this.notifications.sendToTokens(
        NotificationType.habitStart,
        usersHabitStart.map(([userId, { lang, sessions, id }]) => ({
          lang,
          userId: +userId,
          sessions,
          id,
        })),
      );
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async dailyNotification() {
    const usersEveryMorning = await this.users.getAllByTime({ time: '09:00' });
    const usersNotPaidMorning = await this.users.getAllByTime(
      { time: '10:00' },
      { role: UserRole.mobileUnsubscribed },
    );
    const usersTaskStart = await this.users.getAllExercisesNotCompleted({ time: '16:00' });
    const usersEveryEvening = await this.users.getAllByTime({ time: '21:00' });

    if (usersEveryMorning.length) {
      this.notifications.sendToTokens(
        NotificationType.everyMorning,
        usersEveryMorning.map(({ id, lang, sessions }) => ({
          userId: id,
          lang,
          sessions: sessions.map(({ id, fcmToken }) => ({ id, token: fcmToken })),
        })),
      );
    }

    if (usersNotPaidMorning.length) {
      this.notifications.sendToTokens(
        NotificationType.notPaidMorning,
        usersNotPaidMorning.map(({ id, lang, sessions }) => ({
          userId: id,
          lang,
          sessions: sessions.map(({ id, fcmToken }) => ({ id, token: fcmToken })),
        })),
      );
    }

    if (usersTaskStart.length) {
      this.notifications.sendToTokens(
        NotificationType.taskStart,
        usersTaskStart.map(({ id, lang, sessions, courses }) => ({
          userId: id,
          lang,
          sessions: sessions.map(({ id, fcmToken }) => ({ id, token: fcmToken })),
          id: courses[0]?.UserCourse.courseStepExerciseId || undefined,
        })),
      );
    }

    if (usersEveryEvening.length) {
      this.notifications.sendToTokens(
        NotificationType.everyEvening,
        usersEveryEvening.map(({ id, lang, sessions }) => ({
          userId: id,
          lang,
          sessions: sessions.map(({ id, fcmToken }) => ({ id, token: fcmToken })),
        })),
      );
    }
  }

  @Cron('0 */5 */15 * * *')
  async treeNotification() {
    const users15 = await this.users.getAllByTime({ time: '15:00' });

    if (users15.length) {
      this.notifications.sendToTokens(
        NotificationType.tree,
        users15.map(({ id, lang, sessions }) => ({
          userId: id,
          lang,
          sessions: sessions.map(({ id, fcmToken }) => ({ id, token: fcmToken })),
        })),
      );
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshSubscriptions() {
    const subscriptions = await this.appleSubscriptions.getAll({
      where: {
        expiresDate: {
          [Op.lt]: Date.now(),
        },
        isActive: true,
      },
    });

    for (const { userId, password, receipt: data } of subscriptions) {
      await this.subscriptions.verifyReceiptUpdate(
        { type: SubscriptionType.apple, data, password },
        userId,
      );
    }
  }
}
