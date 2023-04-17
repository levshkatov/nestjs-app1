import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Attributes,
  BulkCreateOptions,
  CreationAttributes,
  DestroyOptions,
  Op,
  WhereOptions,
} from 'sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { BS } from '../../shared/interfaces/scopes.interface';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import { MainOrmService } from '../main-orm.service';
import { ILetterI18n } from './interfaces/letter-i18n.interface';
import { LetterOrmGetAllAdmin } from './interfaces/letter-orm.interface';
import { ILetter, LetterScopesMap } from './interfaces/letter.interface';
import { LetterI18n } from './letter-i18n.model';
import { Letter } from './letter.model';

@Injectable()
export class LetterOrmService extends MainOrmService<Letter, LetterScopesMap> {
  constructor(
    @InjectModel(Letter)
    private letter: typeof Letter,

    @InjectModel(LetterI18n)
    private letterI18n: typeof LetterI18n,
  ) {
    super(letter);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    { id, name, trigger }: LetterOrmGetAllAdmin,
  ): Promise<
    PaginatedList<'letters', BS<ILetter, LetterScopesMap, 'i18nSearch' | 'courseStepLetters'>>
  > {
    const whereOptions: WhereOptions<ILetter> = [];
    const i18nWhereOptions: WhereOptions<ILetterI18n> = [];

    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'Letter', col: 'id' }, id, 'text'));
    }
    if (trigger) {
      whereOptions.push({ trigger });
    }

    if (name) {
      i18nWhereOptions.push(whereColILike({ table: 'i18n', col: 'name' }, name));
    }

    const {
      pages,
      total,
      rows: letters,
    } = await this.getAllAndCount<'i18nSearch' | 'courseStepLetters'>(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      [{ method: ['i18nSearch', i18nWhereOptions] }, { method: 'courseStepLetters' }],
      '"Letter"."id"',
    );

    return { pages, total, letters };
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<LetterI18n>>,
    options?: BulkCreateOptions<Attributes<LetterI18n>>,
  ): Promise<Attributes<LetterI18n>[]> {
    return MainOrmService.bulkCreate(this.letterI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<LetterI18n>>): Promise<number> {
    return MainOrmService.destroy(this.letterI18n, options);
  }
}
