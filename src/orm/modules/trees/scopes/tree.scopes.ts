import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { ITree, TreeScopesMap } from '../interfaces/tree.interface';
import { TreeI18n } from '../tree-i18n.model';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../shared/scopes/photo.scope';

export const treeScopes: TScopes<ITree, TreeScopesMap> = {
  i18n: i18nScope(TreeI18n),
  photo: photoScope('photo'),
};
