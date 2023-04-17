import { Lang } from '../../../../shared/interfaces/lang.enum';
import { OffsetUTC } from '../../../../shared/interfaces/offset-utc.enum';
import { BS, Through, ThroughR } from '../../../shared/interfaces/scopes.interface';
import { ICourse } from '../../courses/interfaces/course.interface';
import {
  HabitCategoryBalanceScopesMap,
  IHabitCategoryBalance,
} from '../../habits/categories/balances/interfaces/habit-category-balance.interface';
import { HabitScopesMap, IHabit } from '../../habits/interfaces/habit.interface';
import { IInterestingChecklist } from '../../interesting/checklists/interfaces/interesting-checklist.interface';
import { ILetter, LetterScopesMap } from '../../letters/interfaces/letter.interface';
import { IMedia } from '../../media/interfaces/media.interface';
import { IUserBalance } from '../balances/interfaces/user-balance.interface';
import { IUserClaim } from '../claims/interfaces/user-claim.interface';
import { IUserCourse } from '../courses/interfaces/user-course.interface';
import { IUserHabitData } from '../habit-datas/interfaces/user-habit-data.interface';
import { IUserHabit } from '../habits/interfaces/user-habit.interface';
import { IUserInterestingChecklistData } from '../interesting-checklist-datas/interfaces/user-interesting-checklist-data.interface';
import { IUserLetter } from '../letters/interfaces/user-letter.interface';
import { IUserProfile } from '../profiles/interfaces/user-profile.interface';
import { IUserSession } from '../sessions/interfaces/user-session.interface';
import { IUserSocial } from '../socials/interfaces/user-social.interface';
import { IUserVerifyCode } from '../verify-codes/interfaces/user-verify-code.interface';
import { UserRole } from './user-role.enum';

export interface IUser {
  id: number;
  role: UserRole;
  phone: string | null;
  email: string | null;
  username: string | null;
  passwordHash: string | null;
  offsetUTC: OffsetUTC;
  lang: Lang;
  newPhone: string | null;
  createdAt: Date;
  updatedAt: Date;

  balances?: (IHabitCategoryBalance & Through<'UserBalance', IUserBalance>)[];
  claims?: IUserClaim[];
  checklistDatas?: (IInterestingChecklist &
    Through<'UserInterestingChecklistData', IUserInterestingChecklistData>)[];
  courses?: (ICourse & Through<'UserCourse', IUserCourse>)[];
  habits?: (IHabit & Through<'UserHabit', IUserHabit>)[];
  habitDatas?: IUserHabitData[];
  letters?: (ILetter & Through<'UserLetter', IUserLetter>)[];
  profile?: IUserProfile;
  sessions?: IUserSession[];
  socials?: IUserSocial[];
  verifyCode?: IUserVerifyCode;
  uploads?: IMedia[];
}

export type UserScopesMap = {
  coursesActive: ['courses', ICourse[]];
  exercisesNotCompleted: ['courses', (ICourse & ThroughR<'UserCourse', IUserCourse>)[]];
  profile: ['profile', undefined];
  profileSearch: ['profile', undefined];
  socials: ['socials', undefined];
  verifyCode: ['verifyCode', undefined];
  sessions: ['sessions', undefined];
  sessionsWithFcm: ['sessions', RemoveNullReturnAll<IUserSession, 'fcmToken'>[]];
  habits: [
    'habits',
    (BS<IHabit, HabitScopesMap, 'i18n' | 'category' | 'task'> &
      ThroughR<'UserHabit', IUserHabit>)[],
  ];
  habitsCompleted: ['habits', undefined];
  balances: [
    'balances',
    (BS<IHabitCategoryBalance, HabitCategoryBalanceScopesMap, 'i18n' | 'habitCategory'> &
      ThroughR<'UserBalance', IUserBalance>)[],
  ];
  balancesCompleted: ['balances', undefined];
  letters: ['letters', BS<ILetter, LetterScopesMap, 'i18n'>[]];
};
