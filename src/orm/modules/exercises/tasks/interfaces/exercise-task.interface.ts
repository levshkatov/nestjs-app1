import { BS } from '../../../../shared/interfaces/scopes.interface';
import { ITask, TaskScopesMap } from '../../../tasks/interfaces/task.interface';
import { IExercise, ExerciseScopesMap } from '../../interfaces/exercise.interface';

export interface IExerciseTask {
  exerciseId: number;
  taskId: number;
  index: number;
  createdAt: Date;
  updatedAt: Date;

  task?: ITask;
  exercise?: IExercise;
}

export type ExerciseTaskScopesMap = {
  task: ['task', BS<ITask, TaskScopesMap, 'i18n'>];
  taskSearch: ['task', BS<ITask, TaskScopesMap, 'i18n'>];
  exercise: ['exercise', BS<IExercise, ExerciseScopesMap, 'i18n'>];
};
