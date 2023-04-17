import { BS } from '../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';

export interface IInterestingImage {
  id: number;
  photoId: number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  photo?: IMedia;
}

export type InterestingImageScopesMap = {
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
};
