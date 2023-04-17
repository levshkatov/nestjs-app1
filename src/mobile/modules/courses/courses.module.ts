import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
