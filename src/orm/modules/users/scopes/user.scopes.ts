import { Op, OrderItem, Sequelize } from 'sequelize';
import { USER_COURSE_MAX_EXERCISES } from '../courses/interfaces/user-course.constants';
import { setScope } from '../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { searchScope } from '../../../shared/scopes/search.scope';
import { Course } from '../../courses/course.model';
import { HabitCategoryBalance } from '../../habits/categories/balances/habit-category-balance.model';
import { HabitCategoryBalanceScopesMap } from '../../habits/categories/balances/interfaces/habit-category-balance.interface';
import { Habit } from '../../habits/habit.model';
import { HabitScopesMap } from '../../habits/interfaces/habit.interface';
import { LetterScopesMap } from '../../letters/interfaces/letter.interface';
import { Letter } from '../../letters/letter.model';
import { IUser, UserScopesMap } from '../interfaces/user.interface';
import { UserProfile } from '../profiles/user-profile.model';
import { UserSession } from '../sessions/user-session.model';
import { UserSocial } from '../socials/user-social.model';
import { UserVerifyCode } from '../verify-codes/user-verify-code.model';

export const userScopes: TScopes<IUser, UserScopesMap> = {
  coursesActive: () => ({
    include: {
      model: Course.unscoped(),
      through: {
        where: {
          isCompleted: false,
        },
        attributes: [],
      },
    },
  }),
  exercisesNotCompleted: () => ({
    include: {
      model: Course.unscoped(),
      required: true,
      through: {
        where: {
          exercisesCompletedToday: { [Op.lt]: USER_COURSE_MAX_EXERCISES },
          isCompleted: false,
          courseStepExerciseId: { [Op.ne]: null },
        },
      },
    },
  }),
  profile: () => ({
    include: {
      model: UserProfile.unscoped(),
    },
  }),
  profileSearch: searchScope(UserProfile),
  socials: () => ({
    include: {
      model: UserSocial.unscoped(),
    },
  }),
  verifyCode: () => ({
    include: {
      model: UserVerifyCode.unscoped(),
    },
  }),
  sessions: () => ({
    include: {
      model: UserSession.unscoped(),
    },
  }),
  sessionsWithFcm: () => ({
    include: {
      model: UserSession.unscoped(),
      where: {
        fcmToken: { [Op.ne]: null },
      },
    },
  }),
  habits: () => ({
    include: {
      model: setScope<Habit, keyof HabitScopesMap>(Habit, ['i18n', 'category', 'task']),
    },
  }),
  habitsCompleted: () => ({
    include: {
      model: Habit.unscoped(),
      through: {
        where: {
          isCompleted: true,
        },
        attributes: [],
      },
    },
  }),
  balances: () => ({
    include: {
      model: setScope<HabitCategoryBalance, keyof HabitCategoryBalanceScopesMap>(
        HabitCategoryBalance,
        ['i18n', 'habitCategory'],
      ),
    },
  }),
  balancesCompleted: () => ({
    include: {
      model: HabitCategoryBalance.unscoped(),
      through: {
        where: {
          isCompleted: true,
        },
        attributes: [],
      },
    },
  }),
  letters: () => ({
    include: {
      model: setScope<Letter, keyof LetterScopesMap>(Letter, ['i18n']),
      through: { attributes: [] },
    },
  }),
};

export const userOrders: Record<'habits', OrderItem> = {
  habits: [Sequelize.literal(`"habits->UserHabit"."time"`), 'ASC'],
};
