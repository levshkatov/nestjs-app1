import { BS } from '../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../media/interfaces/media.interface';
import { ILevelI18n } from './level-i18n.interface';

export interface ILevel {
  id: number;
  index: number;
  photoId: number;
  createdAt: Date;
  updatedAt: Date;

  i18n?: ILevelI18n[];
  photo?: IMedia;
}

export type LevelScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
};
