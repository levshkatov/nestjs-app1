import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op, Sequelize } from 'sequelize';
import { WhereOptions } from 'sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../main-orm.service';
import { UserRole } from './interfaces/user-role.enum';
import { User } from './user.model';
import { IUser, UserScopesMap } from './interfaces/user.interface';
import { BS, IScopeOption } from '../../shared/interfaces/scopes.interface';
import { TimeCompareOptions } from './interfaces/time-compare-options.interface';
import { Sequelize as SequelizeTS } from 'sequelize-typescript';
import {
  UserHabitStartQueryRes,
  UserHabitStartRet,
  UserOrmGetAllAdmin,
} from './interfaces/user-orm.interface';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import { IUserProfile } from './profiles/interfaces/user-profile.interface';
import { Literal } from 'sequelize/types/utils';

type UserType = 'mobile' | 'web' | 'all';

@Injectable()
export class UserOrmService extends MainOrmService<User, UserScopesMap> {
  constructor(@InjectModel(User) private user: typeof User, private sequelize: SequelizeTS) {
    super(user);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    { id, role: _role, type, name }: UserOrmGetAllAdmin,
  ): Promise<PaginatedList<'users', BS<IUser, UserScopesMap, 'profile'>>> {
    const role = _role ? _role : type ? { [Op.iLike]: `${type}%` } : null;

    const whereOptions: WhereOptions<IUser> = [];
    const profileWhereOptions: WhereOptions<IUserProfile> = [];

    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'User', col: 'id' }, id, 'text'));
    }
    if (role) {
      whereOptions.push({ role });
    }

    if (name) {
      profileWhereOptions.push(whereColILike({ table: 'profile', col: 'name' }, name));
    }

    const {
      pages,
      total,
      rows: users,
    } = await this.getAllAndCount<'profileSearch'>(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      [{ method: ['profileSearch', profileWhereOptions] }],
      '"User"."id"',
    );

    return { pages, total, users };
  }

  async getAllType<ScopeName extends keyof UserScopesMap>(
    options?: FindOptions<IUser>,
    type?: UserType,
    scopes?: ScopeName[] | IScopeOption<ScopeName>[],
  ): Promise<BS<IUser, UserScopesMap, ScopeName>[]> {
    return this.getAll(this.processOptions(options, type), scopes);
  }

  async getOneType<ScopeName extends keyof UserScopesMap>(
    options?: FindOptions<IUser>,
    type?: UserType,
    scopes?: ScopeName[] | IScopeOption<ScopeName>[],
  ): Promise<BS<IUser, UserScopesMap, ScopeName> | null> {
    return this.getOne(this.processOptions(options, type), scopes);
  }

  private processOptions(options?: FindOptions<IUser>, type?: UserType): FindOptions<IUser> {
    if (!type || type === 'all') {
      return options || {};
    }

    const role = {
      [Op.or]: [Object.values(UserRole).filter((value) => value.startsWith(type))],
    };

    const where: WhereOptions<IUser> = options?.where ? { ...options.where, role } : { role };
    return options ? { ...options, where } : { where };
  }

  private buildTimeLiteral({
    time,
    compareOperator = '=',
    offset = '+00:00',
  }: TimeCompareOptions): Literal {
    return Sequelize.literal(
      `date_trunc('minute', (timezone('utc', now()) + ("offsetUTC"::text)::interval)::time) ${compareOperator} ${this.sequelize.escape(
        time,
      )}::time + ${this.sequelize.escape(offset)}::interval`,
    );
  }

  async getAllHabitStart() {
    const [results] = await this.sequelize.query(`
    select
      "Users"."id",
      "Users"."lang",
      "UserHabits"."habitId",
      "UserSessions"."id" as "sessionId",
      "UserSessions"."fcmToken" as "token"
    from
      "Users"
    inner join "UserSessions" on
      "Users"."id" = "UserSessions"."userId"
      and "UserSessions"."fcmToken" is not null
    inner join "UserHabits"
      on "Users"."id" = "UserHabits"."userId"
      and "UserHabits"."isCompleted" = false
      and "UserHabits"."time" - '00:15'::interval = date_trunc('minute', (timezone('utc', now()) + ("Users"."offsetUTC"::text)::interval)::time);`);

    const ret: Record<number, UserHabitStartRet> = {};

    for (const { id, lang, habitId, sessionId, token } of results as UserHabitStartQueryRes[]) {
      if (!ret[id]) {
        ret[id] = {
          lang,
          sessions: [
            {
              id: sessionId,
              token,
            },
          ],
          id: habitId,
        };
      } else if (!ret[id]!.sessions.find((session) => session.id === sessionId)) {
        ret[id]!.sessions.push({ id: sessionId, token });
      }
    }

    return ret;
  }

  async getAllByTime(
    timeOptions: TimeCompareOptions,
    whereOptions?: WhereOptions<IUser>,
  ): Promise<BS<IUser, UserScopesMap, 'sessionsWithFcm'>[]> {
    const literal = this.buildTimeLiteral(timeOptions);

    const where: WhereOptions<IUser> = whereOptions
      ? { [Op.and]: [literal, whereOptions] }
      : literal;

    return this.getAll(
      {
        where,
      },
      ['sessionsWithFcm'],
    );
  }

  async getAllByTimeWithHabits(
    timeOptions: TimeCompareOptions,
  ): Promise<BS<IUser, UserScopesMap, 'habitsCompleted'>[]> {
    return this.getAll(
      {
        where: this.buildTimeLiteral(timeOptions),
      },
      ['habitsCompleted'],
    );
  }

  async getAllByTimeWithCourses(
    timeOptions: TimeCompareOptions,
  ): Promise<BS<IUser, UserScopesMap, 'coursesActive'>[]> {
    return this.getAll(
      {
        where: this.buildTimeLiteral(timeOptions),
      },
      ['coursesActive'],
    );
  }

  async getAllExercisesNotCompleted(
    timeOptions: TimeCompareOptions,
  ): Promise<BS<IUser, UserScopesMap, 'exercisesNotCompleted' | 'sessionsWithFcm'>[]> {
    return this.getAll(
      {
        where: this.buildTimeLiteral(timeOptions),
      },
      ['exercisesNotCompleted', 'sessionsWithFcm'],
    );
  }
}
