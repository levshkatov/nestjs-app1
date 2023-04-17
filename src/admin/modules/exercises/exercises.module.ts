import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { ExerciseTasksController } from './tasks/exercise-tasks.controller';
import { ExerciseTasksService } from './tasks/exercise-tasks.service';

@Module({
  imports: [],
  controllers: [ExerciseTasksController, ExercisesController],
  providers: [ExercisesService, ExerciseTasksService],
})
export class ExercisesModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
