import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import { Celebrity } from '../../../celebrities/celebrity.model';
import { CelebrityScopesMap } from '../../../celebrities/interfaces/celebrity.interface';
import { IUserCelebrity, UserCelebrityScopesMap } from '../interfaces/user-celebrity.interface';

export const userCelebrityScopes: TScopes<IUserCelebrity, UserCelebrityScopesMap> = {
  celebrity: () => ({
    include: {
      model: setScope<Celebrity, keyof CelebrityScopesMap>(Celebrity, ['i18n', 'photo']),
    },
  }),
};
