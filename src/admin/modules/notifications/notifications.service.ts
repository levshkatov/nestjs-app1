import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { INotification } from '../../../orm/modules/notifications/interfaces/notification.interface';
import { NotificationOrmService } from '../../../orm/modules/notifications/notification-orm.service';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { createDisclaimer } from '../../../shared/helpers/create-disclaimer.helper';
import { createError } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../shared/interfaces/paginated.interface';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import {
  NotificationsForListDto,
  NotificationCreateReqDto,
  NotificationDetailedDto,
  NotificationEditReqDto,
  NotificationsReqDto,
} from './dtos/notification.dto';
import { NotificationsMapper } from './notifications.mapper';

@Injectable()
export class NotificationsService {
  constructor(
    private i18n: I18nHelperService,
    private notifications: NotificationOrmService,
    private notificationsMapper: NotificationsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    pagination: Pagination,
    dto: NotificationsReqDto,
  ): Promise<NotificationsForListDto> {
    const { pages, total, notifications } = await this.notifications.getAllAdmin(pagination, dto);

    return {
      pages,
      total,
      notifications: notifications.map((notification) =>
        this.notificationsMapper.toNotificationForListDto(i18n, notification),
      ),
      disclaimer: createDisclaimer(
        i18n,
        'notifications.forbiddenIfOneInType',
        'notifications.forbiddenToEditType',
      ),
    };
  }

  async create(
    i18n: I18nContext,
    { type, translations }: NotificationCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    const notification = await this.notifications.create({ type });

    await this.notifications.createI18n(
      this.i18n.createTranslations(translations, { notificationId: notification.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<NotificationDetailedDto> {
    const notification = await this.notifications.getOneFromAll({ where: { id } }, ['i18n']);
    if (!notification) {
      throw createError(i18n, 'get', 'notifications.notFound');
    }

    return this.notificationsMapper.toNotificationDetailedDto(i18n, notification);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { type, translations }: NotificationEditReqDto,
  ): Promise<OkDto> {
    const notification = await this.notifications.getOne({ where: { id } });
    if (!notification) {
      throw createError(i18n, 'edit', 'notifications.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const notificationUpdate: Partial<GetRequired<INotification>> = {};

    if (notification.type !== type) {
      throw createError(i18n, 'edit', 'notifications.editType');
    }

    if (Object.keys(notificationUpdate).length) {
      await this.notifications.update(notificationUpdate, { where: { id } });
    }

    await this.notifications.destroyI18n({ where: { notificationId: id } });
    await this.notifications.createI18n(
      this.i18n.createTranslations(translations, { notificationId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    const notification = await this.notifications.getOne({ where: { id } });
    if (!notification) {
      throw createError(i18n, 'delete', 'notifications.notFound');
    }

    const count = await this.notifications.count({ where: { type: notification.type } });
    if (count <= 1) {
      throw createError(i18n, 'delete', 'notifications.lastInType');
    }

    if ((await this.notifications.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'notifications.notFound');
    }

    return new OkDto();
  }
}
