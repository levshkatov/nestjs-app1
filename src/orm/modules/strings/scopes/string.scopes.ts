import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { IString, StringScopesMap } from '../interfaces/string.interface';
import { StringI18n } from '../string-i18n.model';
import { i18nScope } from '../../../shared/scopes/i18n.scope';

export const stringScopes: TScopes<IString, StringScopesMap> = {
  i18n: i18nScope(StringI18n),
};
