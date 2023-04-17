import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { NotificationI18n } from './notification-i18n.model';
import { BulkCreateOptions, DestroyOptions, Op, Sequelize, WhereOptions } from 'sequelize';
import { CreationAttributes, Attributes } from 'sequelize/types';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { whereColILike } from '../../shared/helpers/where-col-like.helper';
import { BS } from '../../shared/interfaces/scopes.interface';
import { PaginatedList } from '../interfaces/paginated-list.interface';
import { MainOrmService } from '../main-orm.service';
import { NotificationOrmGetAllAdmin } from './interfaces/notification-orm.interface';
import { INotification, NotificationScopesMap } from './interfaces/notification.interface';
import { NotificationType } from './interfaces/notification-type.enum';

@Injectable()
export class NotificationOrmService extends MainOrmService<Notification, NotificationScopesMap> {
  constructor(
    @InjectModel(Notification)
    private notification: typeof Notification,

    @InjectModel(NotificationI18n)
    private notificationI18n: typeof NotificationI18n,
  ) {
    super(notification);
    logClassName(this.constructor.name, __filename);
  }

  async getAllAdmin(
    { offset, limit }: Pagination,
    { id, type }: NotificationOrmGetAllAdmin,
  ): Promise<PaginatedList<'notifications', BS<INotification, NotificationScopesMap, 'i18n'>>> {
    const whereOptions: WhereOptions<INotification> = [];

    if (id !== undefined) {
      whereOptions.push(whereColILike({ table: 'Notification', col: 'id' }, id, 'text'));
    }
    if (type) {
      whereOptions.push({ type });
    }

    const {
      pages,
      total,
      rows: notifications,
    } = await this.getAllAndCount<'i18n'>(
      {
        where: {
          [Op.and]: whereOptions,
        },
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['i18n'],
      `"Notification"."id"`,
    );

    return { pages, total, notifications };
  }

  async getOneRandom(
    type: NotificationType,
  ): Promise<BS<INotification, NotificationScopesMap, 'i18n'> | null> {
    return await this.getOneFromAll(
      { where: { type }, order: [Sequelize.fn('RANDOM')], limit: 1 },
      ['i18n'],
    );
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<NotificationI18n>>,
    options?: BulkCreateOptions<Attributes<NotificationI18n>>,
  ): Promise<Attributes<NotificationI18n>[]> {
    return MainOrmService.bulkCreate(this.notificationI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<NotificationI18n>>): Promise<number> {
    return MainOrmService.destroy(this.notificationI18n, options);
  }
}
