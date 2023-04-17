import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { ILevel, LevelScopesMap } from '../interfaces/level.interface';
import { LevelI18n } from '../level-i18n.model';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../shared/scopes/photo.scope';

export const levelScopes: TScopes<ILevel, LevelScopesMap> = {
  i18n: i18nScope(LevelI18n),
  photo: photoScope('photo'),
};
