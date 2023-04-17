import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../../main-orm.service';
import { CourseStepExercise } from './course-step-exercise.model';
import { CourseStepExerciseScopesMap } from './interfaces/course-step-exercise.interface';

@Injectable()
export class CourseStepExerciseOrmService extends MainOrmService<
  CourseStepExercise,
  CourseStepExerciseScopesMap
> {
  constructor(
    @InjectModel(CourseStepExercise)
    private courseStepExercise: typeof CourseStepExercise,
  ) {
    super(courseStepExercise);
    logClassName(this.constructor.name, __filename);
  }
}
