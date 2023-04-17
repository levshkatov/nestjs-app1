import { Module } from '@nestjs/common';
import { logClassName } from '../../helpers/log-classname.helper';
import { CryptoHelperService } from './crypto-helper.service';

@Module({
  providers: [CryptoHelperService],
  exports: [CryptoHelperService],
})
export class CryptoHelperModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
