import { BS } from '../../../../../shared/interfaces/scopes.interface';
import { IExercise, ExerciseScopesMap } from '../../../../exercises/interfaces/exercise.interface';
import { ICourseStep, CourseStepScopesMap } from '../../interfaces/course-step.interface';

export interface ICourseStepExercise {
  courseStepId: number;
  exerciseId: number;
  index: number;
  createdAt: Date;
  updatedAt: Date;

  exercise?: IExercise;
  courseStep?: ICourseStep;
}

export type CourseStepExerciseScopesMap = {
  exercise: ['exercise', BS<IExercise, ExerciseScopesMap, 'i18n' | 'exerciseTasks'>];
  exerciseNoTasks: ['exercise', BS<IExercise, ExerciseScopesMap, 'i18n'>];
  courseStep: ['courseStep', BS<ICourseStep, CourseStepScopesMap, 'i18n' | 'course'>];
};
