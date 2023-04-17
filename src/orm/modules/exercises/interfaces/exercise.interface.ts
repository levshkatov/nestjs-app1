import { BS } from '../../../shared/interfaces/scopes.interface';
import {
  ICourseStepExercise,
  CourseStepExerciseScopesMap,
} from '../../courses/steps/exercises/interfaces/course-step-exercise.interface';
import { IInterestingCoaching } from '../../interesting/coachings/interfaces/interesting-coaching.interface';
import { IExerciseTask, ExerciseTaskScopesMap } from '../tasks/interfaces/exercise-task.interface';
import { IExerciseI18n } from './exercise-i18n.interface';

export interface IExercise {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IExerciseI18n[];
  exerciseTasks?: IExerciseTask[];
  courseStepExercises?: ICourseStepExercise[];
  interestingCoachings?: IInterestingCoaching[];
}

export type ExerciseScopesMap = {
  i18n: ['i18n', undefined];
  i18nSearch: ['i18n', undefined];
  exerciseTasks: ['exerciseTasks', BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>[]];
  exerciseTasksSearch: ['exerciseTasks', BS<IExerciseTask, ExerciseTaskScopesMap, 'task'>[]];
  courseStepExercises: [
    'courseStepExercises',
    BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'courseStep'>[],
  ];
  interestingCoachings: ['interestingCoachings', undefined];
};
