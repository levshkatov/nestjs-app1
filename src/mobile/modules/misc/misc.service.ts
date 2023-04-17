import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { randomUUID } from 'node:crypto';
import { Sequelize } from 'sequelize';
import { CourseOrmService } from '../../../orm/modules/courses/course-orm.service';
import { CourseType } from '../../../orm/modules/courses/interfaces/course-type.enum';
import { CourseStepExerciseOrmService } from '../../../orm/modules/courses/steps/exercises/course-step-exercise-orm.service';
import { HabitOrmService } from '../../../orm/modules/habits/habit-orm.service';
import { InterestingArticleOrmService } from '../../../orm/modules/interesting/articles/interesting-article-orm.service';
import { NotificationType } from '../../../orm/modules/notifications/interfaces/notification-type.enum';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Lang } from '../../../shared/interfaces/lang.enum';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { CryptoHelperService } from '../../../shared/modules/crypto/crypto-helper.service';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { IUserData } from '../../../shared/modules/notifications/interfaces/notification.interface';
import { NotificationsService } from '../../../shared/modules/notifications/notifications.service';
import { TelegramHelperService } from '../../../shared/modules/telegram/telegram-helper.service';
import { PopUpService } from '../pop-up/pop-up.service';

@Injectable()
export class MiscService {
  constructor(
    private popup: PopUpService,
    private i18n: I18nHelperService,
    private crypto: CryptoHelperService,
    private users: UserOrmService,
    private notifications: NotificationsService,
    private habits: HabitOrmService,
    private courseStepExercises: CourseStepExerciseOrmService,
    private courses: CourseOrmService,
    private articles: InterestingArticleOrmService,
    private tg: TelegramHelperService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  ping(): OkDto {
    return new OkDto();
  }

  async testPush(i18n: I18nContext, type: NotificationType, jwtUser?: IJWTUser) {
    const user = await this.users.getOneFromAll({ where: { id: jwtUser ? jwtUser.userId : 1 } }, [
      'sessionsWithFcm',
    ]);
    if (!user) {
      throw new Error('No user');
    }

    const { lang, sessions, id: userId } = user;

    const userData: IUserData[] = [];
    let id = undefined;

    switch (type) {
      case NotificationType.newHabit:
      case NotificationType.habitStart:
        const habit = await this.habits.getOne({
          where: { disabled: false },
          order: [Sequelize.fn('RANDOM')],
          limit: 1,
        });
        id = habit?.id;
        break;

      case NotificationType.taskStart:
        const exercise = await this.courseStepExercises.getOne({
          where: { courseStepId: 37 },
          order: [Sequelize.fn('RANDOM')],
          limit: 1,
        });
        id = exercise?.exerciseId;
        break;

      case NotificationType.newCourseCategory:
        const course = await this.courses.getOne({
          where: { type: CourseType.category, disabled: false },
          order: [Sequelize.fn('RANDOM')],
          limit: 1,
        });
        id = course?.id;
        break;

      case NotificationType.newArticle:
        const article = await this.articles.getOne({
          where: { disabled: false },
          order: [Sequelize.fn('RANDOM')],
          limit: 1,
        });
        id = article?.id;
        break;
    }

    userData.push({
      lang,
      userId,
      sessions: sessions.map(({ id, fcmToken }) => ({ id, token: fcmToken })),
      id,
    });

    this.notifications.sendToTokens(type, userData);
    return new OkDto();
  }

  async test(i18n: I18nContext): Promise<OkDto> {
    // const refreshToken = randomUUID();
    // const refreshTokenHash = await this.crypto.hash(refreshToken);
    // console.log(refreshToken);
    // console.log(refreshTokenHash);

    // this.tg.log('Test', ['123', '456']);

    return new OkDto();
  }
}
