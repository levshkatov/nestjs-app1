import { BS } from '../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';
import { IInterestingHelpI18n } from './interesting-help-i18n.interface';

export interface IInterestingHelp {
  id: number;
  photoId: number;
  audioId: number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IInterestingHelpI18n[];
  photo?: IMedia;
  audio?: IMedia;
}

export type InterestingHelpScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  audio: ['audio', undefined];
};
