import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { INotificationI18n } from '../../../orm/modules/notifications/interfaces/notification-i18n.interface';
import {
  INotification,
  NotificationScopesMap,
} from '../../../orm/modules/notifications/interfaces/notification.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import {
  NotificationDetailedDto,
  NotificationI18nDto,
  NotificationForListDto,
} from './dtos/notification.dto';

@Injectable()
export class NotificationsMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }

  toNotificationForListDto(
    i18nContext: I18nContext,
    { id, type, i18n }: BS<INotification, NotificationScopesMap, 'i18n'>,
  ): NotificationForListDto {
    return {
      id,
      type,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      text: this.i18n.getValue(i18nContext, i18n, 'text'),
    };
  }

  toNotificationDetailedDto(
    i18nContext: I18nContext,
    { id, type, i18n }: BS<INotification, NotificationScopesMap, 'i18n'>,
    disclaimer?: string,
  ): NotificationDetailedDto {
    return {
      disclaimer,
      id,
      type,
      translations: i18n.map((el) => this.toNotificationI18nDto(i18nContext, el)),
    };
  }

  toNotificationI18nDto(
    i18nContext: I18nContext,
    { lang, title, text }: INotificationI18n,
  ): NotificationI18nDto {
    return {
      lang,
      title,
      text,
    };
  }
}
