import { Injectable } from '@nestjs/common';
import {
  INotification,
  NotificationScopesMap,
} from '../../../orm/modules/notifications/interfaces/notification.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { Lang } from '../../interfaces/lang.enum';
import { NotificationData } from './interfaces/notification.interface';

@Injectable()
export class NotificationsMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }

  toNotificationData(
    lang: Lang,
    { type, i18n }: BS<INotification, NotificationScopesMap, 'i18n'>,
    id?: number,
  ): NotificationData {
    const ret: NotificationData = {
      type,
      title: this.i18n.getValueNoI18n(lang, i18n, 'title'),
      text: this.i18n.getValueNoI18n(lang, i18n, 'text'),
    };

    if (id) {
      ret.id = `${id}`;
    }

    return ret;
  }
}
