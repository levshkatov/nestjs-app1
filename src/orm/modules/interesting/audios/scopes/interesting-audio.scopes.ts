import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { InterestingAudioI18n } from '../interesting-audio-i18n.model';
import {
  IInterestingAudio,
  InterestingAudioScopesMap,
} from '../interfaces/interesting-audio.interface';
import { i18nScope } from '../../../../shared/scopes/i18n.scope';
import { Media } from '../../../media/media.model';

export const interestingAudioScopes: TScopes<IInterestingAudio, InterestingAudioScopesMap> = {
  i18n: i18nScope(InterestingAudioI18n),
  audio: () => ({
    include: {
      model: Media.unscoped(),
      as: 'audio',
    },
  }),
};
