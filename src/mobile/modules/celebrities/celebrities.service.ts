import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../pop-up/pop-up.service';
import { CelebritiesMapper } from './celebrities.mapper';
import {
  CelebrityDetailedDto,
  CelebrityForListDto,
  CelebrityRemoveDto,
  CelebrityStartDto,
} from './dtos/celebrity.dto';
import { CelebrityOrmService } from '../../../orm/modules/celebrities/celebrity-orm.service';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { Op } from 'sequelize';
import { UserHabitOrmService } from '../../../orm/modules/users/habits/user-habit-orm.service';
import { UserCourseOrmService } from '../../../orm/modules/users/courses/user-course-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { omitNullProps } from '../../../shared/helpers/omit-null-props.helper';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { UserCelebrityOrmService } from '../../../orm/modules/users/celebrities/user-celebrity-orm.service';

@Injectable()
export class CelebritiesService {
  constructor(
    private popup: PopUpService,
    private celebrities: CelebrityOrmService,
    private celebritiesMapper: CelebritiesMapper,
    private userCourses: UserCourseOrmService,
    private userHabits: UserHabitOrmService,
    private userCelebrities: UserCelebrityOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext, user?: IJWTUser): Promise<CelebrityForListDto[]> {
    const userCelebrity = user
      ? await this.userCelebrities.getOne({ where: { userId: user.userId } })
      : null;

    return (
      await this.celebrities.getAll(
        {
          where: { disabled: false },
          order: [
            ['index', 'ASC'],
            ['id', 'ASC'],
          ],
        },
        ['photo', 'i18n'],
      )
    ).map((celebrity) =>
      this.celebritiesMapper.toCelebrityForListDto(i18n, celebrity, {
        isAdded: userCelebrity?.celebrityId === celebrity.id,
      }),
    );
  }

  async getOne(
    i18n: I18nContext,
    { id, tag }: { id?: number; tag?: string },
    user?: IJWTUser,
  ): Promise<CelebrityDetailedDto> {
    if (!id && !tag) {
      throw this.popup.error(i18n, `celebrities.notFound`);
    }

    const celebrity = await this.celebrities.getOneFromAll(
      {
        where: { ...omitNullProps({ id, tag }), disabled: false },
      },
      ['i18n', 'photo', 'celebrityHabits'],
    );
    if (!celebrity) {
      throw this.popup.error(i18n, `celebrities.notFound`);
    }

    const userCelebrity = user
      ? await this.userCelebrities.getOne({ where: { userId: user.userId } })
      : null;

    return this.celebritiesMapper.toCelebrityDetailedDto(i18n, celebrity, {
      isAdded: userCelebrity?.celebrityId === celebrity.id,
    });
  }

  async start(
    i18n: I18nContext,
    celebrityId: number,
    { force }: CelebrityStartDto,
    { userId }: IJWTUser,
  ): Promise<PopUpDto> {
    const celebrity = await this.celebrities.getOneFromAll(
      { where: { id: celebrityId, disabled: false } },
      ['i18n', 'photo', 'celebrityHabits'],
    );
    if (!celebrity?.celebrityHabits.length) {
      throw this.popup.error(i18n, `celebrities.notFound`);
    }

    const activeCelebrity = await this.userCelebrities.getOne({ where: { userId } });

    if (activeCelebrity) {
      if (activeCelebrity.celebrityId === celebrityId) {
        throw this.popup.error(i18n, `celebrities.yetStarted`);
      }
      if (!force) {
        throw this.popup.question(i18n, `celebrities.changeCelebrity`);
      }
    }

    const activeCourse = await this.userCourses.getOne({ where: { userId, isCompleted: false } });
    if (!!activeCourse && !force) {
      throw this.popup.question(i18n, `celebrities.activeCourse`);
    }

    const userChallenge = await this.userHabits.getOne({
      where: {
        userId,
        habitId: { [Op.in]: celebrity.celebrityHabits.map(({ habitId }) => habitId) },
        fromCourses: false,
        isChallenge: true,
      },
    });
    if (userChallenge) {
      throw this.popup.error(i18n, `celebrities.existingChallenge`);
    }

    await this.userCourses.destroy({ where: { userId, isCompleted: false } });
    await this.userCelebrities.destroy({ where: { userId } });
    await this.userHabits.destroy({
      where: {
        userId,
        [Op.or]: {
          fromCourses: true,
          fromCelebrities: true,
          habitId: { [Op.in]: celebrity.celebrityHabits.map(({ habitId }) => habitId) },
        },
      },
    });

    await this.userCelebrities.create({ celebrityId, userId });

    await this.userHabits.bulkCreate(
      celebrity.celebrityHabits.map(({ habitId, habit: { time } }) => ({
        userId,
        habitId,
        time,
        isCompleted: false,
        isChallenge: false,
        daysRemaining: 0,
        fromCourses: false,
        fromCelebrities: true,
      })),
    );

    throw this.popup.ok(i18n, `celebrities.added`);
  }

  async remove(
    i18n: I18nContext,
    celebrityId: number,
    { force }: CelebrityRemoveDto,
    { userId }: IJWTUser,
  ): Promise<PopUpDto> {
    const celebrity = await this.celebrities.getOne({
      where: { id: celebrityId, disabled: false },
    });
    if (!celebrity) {
      throw this.popup.error(i18n, `celebrities.notFound`);
    }

    const userCelebrity = await this.userCelebrities.getOne({ where: { userId } });

    if (!userCelebrity) {
      throw this.popup.error(i18n, `courses.notFound`);
    }

    if (!force) {
      throw this.popup.question(i18n, `celebrities.removeCelebrity`);
    }

    await this.userCelebrities.destroy({ where: { userId } });
    await this.userHabits.destroy({ where: { userId, fromCelebrities: true } });

    throw this.popup.ok(i18n, `celebrities.removed`);
  }
}
