import { BS } from '../../../shared/interfaces/scopes.interface';
import { IUser, UserScopesMap } from '../../users/interfaces/user.interface';
import { MediaExtension } from './media-extension.enum';
import { IMediaPhotoSize } from './media-photo-size.interface';
import { MediaType } from './media-type.enum';

export interface IMedia {
  id: number;
  authorId: number | null;
  tag: string | null;
  originalName: string | null;
  size: number | null;
  type: MediaType;
  extension: MediaExtension;
  src: string;
  blurHash: string | null;
  createdAt: Date;
  updatedAt: Date;

  photoSizes?: IMediaPhotoSize[];
  author?: IUser;
}

export type MediaScopesMap = {
  photoSizes: ['photoSizes', undefined];
  author: ['author', BS<IUser, UserScopesMap, 'profile'>];
};
