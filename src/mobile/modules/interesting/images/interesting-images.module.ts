import { Module } from '@nestjs/common';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingImagesController } from './interesting-images.controller';
import { InterestingImagesService } from './interesting-images.service';

@Module({
  imports: [],
  controllers: [InterestingImagesController],
  providers: [InterestingImagesService],
})
export class InterestingImagesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
