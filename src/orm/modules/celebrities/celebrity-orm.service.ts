import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../main-orm.service';
import { Celebrity } from './celebrity.model';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { CelebrityScopesMap, ICelebrity } from './interfaces/celebrity.interface';
import { CelebrityI18n } from './celebrity-i18n.model';
import {
  Attributes,
  BulkCreateOptions,
  CreationAttributes,
  DestroyOptions,
  Op,
  WhereOptions,
} from 'sequelize';
import { CelebrityHabit } from './celebrity-habit.model';
import { BS } from '../../shared/interfaces/scopes.interface';
import { CelebrityOrmGetAllAdmin } from './interfaces/celebrity-orm.interface';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { ICelebrityI18n } from './interfaces/celebrity-i18n.interface';

@Injectable()
export class CelebrityOrmService extends MainOrmService<Celebrity, CelebrityScopesMap> {
  constructor(
    @InjectModel(Celebrity)
    private celebrity: typeof Celebrity,

    @InjectModel(CelebrityI18n)
    private celebrityI18n: typeof CelebrityI18n,

    @InjectModel(CelebrityHabit)
    private celebrityHabit: typeof CelebrityHabit,
  ) {
    super(celebrity);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    { id, name }: CelebrityOrmGetAllAdmin,
  ): Promise<
    PaginatedList<
      'celebrities',
      BS<ICelebrity, CelebrityScopesMap, 'photo' | 'celebrityHabits' | 'i18nSearch'>
    >
  > {
    const whereOptions: WhereOptions<ICelebrity> = [];
    const i18nWhereOptions: WhereOptions<ICelebrityI18n> = [];

    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'Celebrity', col: 'id' }, id, 'text'));
    }

    if (name) {
      i18nWhereOptions.push(whereColILike({ table: 'i18n', col: 'name' }, name));
    }

    const {
      pages,
      total,
      rows: celebrities,
    } = await this.getAllAndCount<'photo' | 'celebrityHabits' | 'i18nSearch'>(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      [
        { method: 'photo' },
        { method: 'celebrityHabits' },
        { method: ['i18nSearch', i18nWhereOptions] },
      ],
      `"Celebrity"."id"`,
    );

    return { pages, total, celebrities };
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<CelebrityI18n>>,
    options?: BulkCreateOptions<Attributes<CelebrityI18n>>,
  ): Promise<Attributes<CelebrityI18n>[]> {
    return MainOrmService.bulkCreate(this.celebrityI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<CelebrityI18n>>): Promise<number> {
    return MainOrmService.destroy(this.celebrityI18n, options);
  }

  async createHabits(
    records: ReadonlyArray<CreationAttributes<CelebrityHabit>>,
    options?: BulkCreateOptions<Attributes<CelebrityHabit>>,
  ): Promise<Attributes<CelebrityHabit>[]> {
    return MainOrmService.bulkCreate(this.celebrityHabit, records, options);
  }

  async destroyHabits(options?: DestroyOptions<Attributes<CelebrityHabit>>): Promise<number> {
    return MainOrmService.destroy(this.celebrityHabit, options);
  }
}
