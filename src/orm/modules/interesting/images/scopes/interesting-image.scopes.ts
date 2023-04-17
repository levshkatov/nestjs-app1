import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { photoScope } from '../../../../shared/scopes/photo.scope';
import {
  IInterestingImage,
  InterestingImageScopesMap,
} from '../interfaces/interesting-image.interface';

export const interestingImageScopes: TScopes<IInterestingImage, InterestingImageScopesMap> = {
  photo: photoScope('photo'),
};
