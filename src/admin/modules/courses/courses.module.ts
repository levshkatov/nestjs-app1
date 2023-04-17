import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseStepsController } from './steps/course-steps.controller';
import { CourseStepsService } from './steps/course-steps.service';
import { CourseStepExercisesController } from './steps/exercises/course-step-exercises.controller';
import { CourseStepExercisesService } from './steps/exercises/course-step-exercises.service';

@Module({
  imports: [],
  controllers: [CourseStepExercisesController, CourseStepsController, CoursesController],
  providers: [CoursesService, CourseStepsService, CourseStepExercisesService],
})
export class CoursesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
