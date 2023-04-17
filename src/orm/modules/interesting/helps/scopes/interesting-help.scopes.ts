import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { InterestingHelpI18n } from '../interesting-help-i18n.model';
import {
  IInterestingHelp,
  InterestingHelpScopesMap,
} from '../interfaces/interesting-help.interface';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import { Media } from '../../../media/media.model';

export const interestingHelpScopes: TScopes<IInterestingHelp, InterestingHelpScopesMap> = {
  i18n: i18nScope(InterestingHelpI18n),
  photo: photoScope('photo'),
  audio: () => ({
    include: {
      model: Media.unscoped(),
      as: 'audio',
    },
  }),
};
