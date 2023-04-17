import {
  BulkCreateOptions,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  UpdateOptions,
  UpsertOptions,
  Attributes,
  ModelStatic,
  CreationAttributes,
  CountOptions,
} from 'sequelize';
import { Model } from 'sequelize-typescript';
import { PAGINATE_LIMIT } from '../../shared/helpers/paginate.helper';
import { buildScopeOptions } from '../shared/helpers/build-scope-options.helper';
import { UpdateAttributes } from '../shared/interfaces/attributes.interface';
import { BS, IScopeOption, ModelScopes } from '../shared/interfaces/scopes.interface';
import { PaginatedList } from './interfaces/paginated-list.interface';

type OriginalUpdateAttributes<M extends Model> = {
  [key in keyof Attributes<M>]?: Attributes<M>[key];
};

export class MainOrmService<
  // @ts-ignore
  M extends Model<Attributes<M>, CreationAttributes<M>>,
  MScopes extends ModelScopes<Attributes<M>>,
> {
  constructor(private model: ModelStatic<M>) {}

  /**
   * If scopes is simple string[], no need to pass ScopeName as function type
   * @example getOne({}, ['photo'])
   *
   * If scopes is {method: any}[], you MUST pass ScopeName
   * @example getOne<'photo'>({}, [{method: 'photo'}])
   */
  async getOne<ScopeName extends Extract<keyof MScopes, string> = never>(
    options?: FindOptions<Attributes<M>>,
    scopes?: ScopeName[] | IScopeOption<ScopeName>[],
  ): Promise<BS<Attributes<M>, MScopes, ScopeName> | null> {
    const row = await this.model.scope(buildScopeOptions(scopes)).findOne(options);
    return row ? row.toJSON() : null;
  }

  /**
   * If scopes is simple string[], no need to pass ScopeName as function type
   * @example getOne({}, ['photo'])
   *
   * If scopes is {method: any}[], you MUST pass ScopeName
   * @example getOne<'photo'>({}, [{method: 'photo'}])
   */
  async getAll<ScopeName extends Extract<keyof MScopes, string> = never>(
    options?: FindOptions<Attributes<M>>,
    scopes?: ScopeName[] | IScopeOption<ScopeName>[],
  ): Promise<BS<Attributes<M>, MScopes, ScopeName>[]> {
    return (await this.model.scope(buildScopeOptions(scopes)).findAll(options)).map((row) =>
      row.toJSON(),
    );
  }

  /**
   * For nested includes with limit. Works like getOne but without bug "missing from-clause entry for table"
   */
  async getOneFromAll<ScopeName extends Extract<keyof MScopes, string> = never>(
    options?: FindOptions<Attributes<M>>,
    scopes?: ScopeName[] | IScopeOption<ScopeName>[],
  ): Promise<BS<Attributes<M>, MScopes, ScopeName> | null> {
    const row = (await this.model.scope(buildScopeOptions(scopes)).findAll(options))[0];
    return row ? row.toJSON() : null;
  }

  /**
   * Get all + count without includes in separate queries
   * @returns [pages: number, rows]
   */
  async getAllAndCount<ScopeName extends Extract<keyof MScopes, string> = never>(
    options?: FindOptions<Attributes<M>>,
    scopes?: ScopeName[] | IScopeOption<ScopeName>[],
    col = 'id',
    limit = PAGINATE_LIMIT,
  ): Promise<PaginatedList<'rows', BS<Attributes<M>, MScopes, ScopeName>>> {
    const rows = (await this.model.scope(buildScopeOptions(scopes)).findAll(options)).map((row) =>
      row.toJSON<BS<Attributes<M>, MScopes, ScopeName>>(),
    );
    const count = await this.model
      .scope(buildScopeOptions(scopes))
      .count({ where: options?.where || {}, distinct: true, col });

    return { pages: Math.ceil(count / limit), total: count, rows };
  }

  async create(
    values: CreationAttributes<M>,
    options?: CreateOptions<Attributes<M>>,
  ): Promise<Attributes<M>> {
    const row = await this.model.create(values, options);
    return row.toJSON();
  }

  async bulkCreate(
    records: ReadonlyArray<CreationAttributes<M>>,
    options?: BulkCreateOptions<Attributes<M>>,
  ): Promise<Attributes<M>[]> {
    const rows = await this.model.bulkCreate(records, options);
    return rows.map((row) => row.toJSON());
  }

  async update(
    values: UpdateAttributes<Attributes<M>>,
    options: UpdateOptions<Attributes<M>>,
  ): Promise<[number, Attributes<M>[]] | [number, null]> {
    if (options.returning) {
      const [num, rows] = await this.model.update(values as OriginalUpdateAttributes<M>, {
        ...options,
        returning: true,
      });
      return [num, rows.map((row) => row.toJSON())];
    } else {
      const [num] = await this.model.update(values as OriginalUpdateAttributes<M>, options);
      return [num, null];
    }
  }

  async upsert(
    values: CreationAttributes<M>,
    options?: UpsertOptions<Attributes<M>>,
  ): Promise<Attributes<M> | null> {
    const [row] = await this.model.upsert(values, options);
    return row ? row.toJSON() : null;
  }

  async destroy(options?: DestroyOptions<Attributes<M>>): Promise<number> {
    return this.model.destroy(options);
  }

  async count<ScopeName extends Extract<keyof MScopes, string> = never>(
    options?: Omit<CountOptions<Attributes<M>>, 'group'>,
    scopes?: ScopeName[] | IScopeOption<ScopeName>[],
  ): Promise<number> {
    return this.model.scope(buildScopeOptions(scopes)).count({ distinct: true, ...options });
  }

  // @ts-ignore
  static async create<M extends Model<Attributes<M>, CreationAttributes<M>>>(
    model: ModelStatic<M>,
    values: CreationAttributes<M>,
    options?: CreateOptions<Attributes<M>>,
  ): Promise<Attributes<M>> {
    return (await model.create(values, options)).toJSON();
  }

  // @ts-ignore
  static async bulkCreate<M extends Model<Attributes<M>, CreationAttributes<M>>>(
    model: ModelStatic<M>,
    records: ReadonlyArray<CreationAttributes<M>>,
    options?: BulkCreateOptions<Attributes<M>>,
  ): Promise<Attributes<M>[]> {
    const rows = await model.bulkCreate(records, options);
    return rows.map((row) => row.toJSON());
  }

  // @ts-ignore
  static async destroy<M extends Model<Attributes<M>, CreationAttributes<M>>>(
    model: ModelStatic<M>,
    options?: DestroyOptions<Attributes<M>>,
  ): Promise<number> {
    return model.destroy(options);
  }
}
