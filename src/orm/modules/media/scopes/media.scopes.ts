import { setScope } from '../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { UserScopesMap } from '../../users/interfaces/user.interface';
import { User } from '../../users/user.model';
import { IMedia, MediaScopesMap } from '../interfaces/media.interface';
import { MediaPhotoSize } from '../media-photo-size.model';

export const mediaScopes: TScopes<IMedia, MediaScopesMap> = {
  photoSizes: () => ({
    include: {
      model: MediaPhotoSize.unscoped(),
    },
  }),
  author: () => ({
    include: {
      model: setScope<User, keyof UserScopesMap>(User, ['profile']),
    },
  }),
};
