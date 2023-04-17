import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingAudiosController } from './interesting-audios.controller';
import { InterestingAudiosService } from './interesting-audios.service';

@Module({
  imports: [],
  controllers: [InterestingAudiosController],
  providers: [InterestingAudiosService],
})
export class InterestingAudiosModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
