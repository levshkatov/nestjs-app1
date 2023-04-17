import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
