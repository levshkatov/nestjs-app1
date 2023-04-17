import { Global, Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { PopUpService } from './pop-up.service';

@Global()
@Module({
  providers: [PopUpService],
  exports: [PopUpService],
})
export class PopUpModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
