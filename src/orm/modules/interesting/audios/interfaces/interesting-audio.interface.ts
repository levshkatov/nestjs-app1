import { IMedia } from '../../../media/interfaces/media.interface';
import { IInterestingAudioI18n } from './interesting-audio-i18n.interface';

export interface IInterestingAudio {
  id: number;
  audioId: number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IInterestingAudioI18n[];
  audio?: IMedia;
}

export type InterestingAudioScopesMap = {
  i18n: ['i18n', undefined];
  audio: ['audio', undefined];
};
