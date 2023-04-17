import { BS } from '../../../../shared/interfaces/scopes.interface';
import { ExerciseScopesMap, IExercise } from '../../../exercises/interfaces/exercise.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';
import {
  IInterestingCategory,
  InterestingCategoryScopesMap,
} from '../../categories/interfaces/interesting-category.interface';

export interface IInterestingCoaching {
  id: number;
  categoryId: number;
  photoId: number;
  exerciseId: number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  photo?: IMedia;
  exercise?: IExercise;
  category?: IInterestingCategory;
}

export type InterestingCoachingScopesMap = {
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  exercise: ['exercise', BS<IExercise, ExerciseScopesMap, 'i18n' | 'exerciseTasks'>];
  exerciseSimple: ['exercise', BS<IExercise, ExerciseScopesMap, 'i18n'>];
  category: ['category', BS<IInterestingCategory, InterestingCategoryScopesMap, 'i18n'>];
};
