import { setScope } from '../helpers/set-scope.helper';
import { ScopesOptions } from 'sequelize-typescript';
import { Media } from '../../modules/media/media.model';
import { MediaScopesMap } from '../../modules/media/interfaces/media.interface';

export const photoScope = (as: string = 'photo'): ScopesOptions => {
  return () => ({
    include: {
      model: setScope<Media, keyof MediaScopesMap>(Media, ['photoSizes']),
      as,
    },
  });
};
