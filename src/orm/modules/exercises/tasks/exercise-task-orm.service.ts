import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { ExerciseTask } from './exercise-task.model';
import { ExerciseTaskScopesMap } from './interfaces/exercise-task.interface';

@Injectable()
export class ExerciseTaskOrmService extends MainOrmService<ExerciseTask, ExerciseTaskScopesMap> {
  constructor(
    @InjectModel(ExerciseTask)
    private exerciseTask: typeof ExerciseTask,
  ) {
    super(exerciseTask);
    logClassName(this.constructor.name, __filename);
  }
}
