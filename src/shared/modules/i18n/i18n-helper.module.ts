import { Global, Module } from '@nestjs/common';
import { logClassName } from '../../helpers/log-classname.helper';
import { I18nHelperService } from './i18n-helper.service';

@Global()
@Module({
  providers: [I18nHelperService],
  exports: [I18nHelperService],
})
export class I18nHelperModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
