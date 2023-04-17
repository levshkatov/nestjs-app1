import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../main-orm.service';
import { Habit } from './habit.model';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { HabitScopesMap, IHabit } from './interfaces/habit.interface';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { HabitOrmGetAllAdmin } from './interfaces/habit-orm.interface';
import {
  Attributes,
  BulkCreateOptions,
  CreationAttributes,
  DestroyOptions,
  Op,
  WhereOptions,
} from 'sequelize';
import { IHabitI18n } from './interfaces/habit-i18n.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { ITask } from '../tasks/interfaces/task.interface';
import { BS } from '../../shared/interfaces/scopes.interface';
import { HabitI18n } from './habit-i18n.model';

@Injectable()
export class HabitOrmService extends MainOrmService<Habit, HabitScopesMap> {
  constructor(
    @InjectModel(Habit)
    private habit: typeof Habit,

    @InjectModel(HabitI18n)
    private habitI18n: typeof HabitI18n,
  ) {
    super(habit);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    {
      id,
      disabled,
      categoryId,
      daypart,
      name,
      taskCategoryName,
      taskId,
      taskName,
      tag,
    }: HabitOrmGetAllAdmin,
  ): Promise<
    PaginatedList<'habits', BS<IHabit, HabitScopesMap, 'category' | 'i18nSearch' | 'taskSearch'>>
  > {
    const whereOptions: WhereOptions<IHabit> = [];
    const i18nWhereOptions: WhereOptions<IHabitI18n> = [];
    const taskWhereOptions: WhereOptions<ITask> = [];

    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'Habit', col: 'id' }, id, 'text'));
    }
    if (categoryId !== undefined) {
      whereOptions.push(whereColILike({ table: 'Habit', col: 'categoryId' }, categoryId, 'text'));
    }
    if (taskId !== undefined) {
      whereOptions.push(whereColILike({ table: 'Habit', col: 'taskId' }, taskId, 'text'));
    }
    if (daypart) {
      whereOptions.push({ daypart });
    }
    if (disabled !== undefined) {
      whereOptions.push({ disabled });
    }
    if (tag) {
      whereOptions.push(whereColILike({ table: 'Habit', col: 'tag' }, tag));
    }

    if (name) {
      i18nWhereOptions.push(whereColILike({ table: 'i18n', col: 'name' }, name));
    }

    if (taskName) {
      taskWhereOptions.push(whereColILike({ table: 'task', col: 'name' }, taskName));
    }
    if (taskCategoryName) {
      taskWhereOptions.push({ categoryName: taskCategoryName });
    }

    const {
      pages,
      total,
      rows: habits,
    } = await this.getAllAndCount<'i18nSearch' | 'category' | 'taskSearch'>(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      [
        { method: ['i18nSearch', i18nWhereOptions] },
        { method: 'category' },
        { method: ['taskSearch', taskWhereOptions] },
      ],
      '"Habit"."id"',
    );

    return { pages, total, habits };
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<HabitI18n>>,
    options?: BulkCreateOptions<Attributes<HabitI18n>>,
  ): Promise<Attributes<HabitI18n>[]> {
    return MainOrmService.bulkCreate(this.habitI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<HabitI18n>>): Promise<number> {
    return MainOrmService.destroy(this.habitI18n, options);
  }
}
