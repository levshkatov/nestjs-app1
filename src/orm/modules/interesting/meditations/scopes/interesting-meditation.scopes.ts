import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { InterestingMeditationI18n } from '../interesting-meditation-i18n.model';
import {
  IInterestingMeditation,
  InterestingMeditationScopesMap,
} from '../interfaces/interesting-meditation.interface';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import { Media } from '../../../media/media.model';
import { InterestingCategory } from '../../categories/interesting-category.model';
import { InterestingCategoryScopesMap } from '../../categories/interfaces/interesting-category.interface';

export const interestingMeditationScopes: TScopes<
  IInterestingMeditation,
  InterestingMeditationScopesMap
> = {
  i18n: i18nScope(InterestingMeditationI18n),
  photo: photoScope('photo'),
  audioFemale: () => ({
    include: {
      model: Media.unscoped(),
      as: 'audioFemale',
    },
  }),
  audioMale: () => ({
    include: {
      model: Media.unscoped(),
      as: 'audioMale',
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
