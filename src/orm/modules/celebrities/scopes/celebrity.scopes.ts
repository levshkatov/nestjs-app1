import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { CelebrityI18n } from '../celebrity-i18n.model';
import { CelebrityScopesMap, ICelebrity } from '../interfaces/celebrity.interface';
import { setScope } from '../../../shared/helpers/set-scope.helper';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { photoScope } from '../../../shared/scopes/photo.scope';
import { searchScope } from '../../../shared/scopes/search.scope';
import { CelebrityHabit } from '../celebrity-habit.model';
import { CelebrityHabitScopesMap } from '../interfaces/celebrity-habit.interface';

export const celebrityScopes: TScopes<ICelebrity, CelebrityScopesMap> = {
  i18n: i18nScope(CelebrityI18n),
  i18nSearch: searchScope(CelebrityI18n),
  celebrityHabits: () => ({
    include: {
      model: setScope<CelebrityHabit, keyof CelebrityHabitScopesMap>(CelebrityHabit, ['habit']),
    },
  }),
  photo: photoScope('photo'),
};
