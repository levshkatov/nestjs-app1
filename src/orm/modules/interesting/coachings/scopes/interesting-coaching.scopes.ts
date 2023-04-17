import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import {
  IInterestingCoaching,
  InterestingCoachingScopesMap,
} from '../interfaces/interesting-coaching.interface';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import { InterestingCategory } from '../../categories/interesting-category.model';
import { InterestingCategoryScopesMap } from '../../categories/interfaces/interesting-category.interface';
import { Exercise } from '../../../exercises/exercise.model';
import { ExerciseScopesMap } from '../../../exercises/interfaces/exercise.interface';
import { OrderItem, Sequelize } from 'sequelize';

export const interestingCoachingScopes: TScopes<
  IInterestingCoaching,
  InterestingCoachingScopesMap
> = {
  photo: photoScope('photo'),
  exercise: () => ({
    include: {
      model: setScope<Exercise, keyof ExerciseScopesMap>(Exercise, ['i18n', 'exerciseTasks']),
    },
  }),
  exerciseSimple: () => ({
    include: {
      model: setScope<Exercise, keyof ExerciseScopesMap>(Exercise, ['i18n']),
    },
  }),
  category: () => ({
    include: {
      model: setScope<InterestingCategory, keyof InterestingCategoryScopesMap>(
        InterestingCategory,
        ['i18n'],
      ),
    },
  }),
};

export const interestingCoachingOrders: Record<'coachingExerciseTasks', OrderItem> = {
  coachingExerciseTasks: [Sequelize.literal(`"exercise->exerciseTasks"."index"`), 'ASC'],
};
