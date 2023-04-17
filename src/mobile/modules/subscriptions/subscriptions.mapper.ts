import { Injectable } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';

@Injectable()
export class SubscriptionsMapper {
  constructor(private i18n: I18nHelperService) {
    logClassName(this.constructor.name, __filename);
  }
}
