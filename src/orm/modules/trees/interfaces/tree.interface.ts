import { BS } from '../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../media/interfaces/media.interface';
import { ITreeI18n } from './tree-i18n.interface';

export interface ITree {
  id: number;
  index: number;
  photoId: number;
  createdAt: Date;
  updatedAt: Date;

  i18n?: ITreeI18n[];
  photo?: IMedia;
}

export type TreeScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
};
