import { TScopes } from '../../../shared/interfaces/scopes.interface';
import { ILetter, LetterScopesMap } from '../interfaces/letter.interface';
import { LetterI18n } from '../letter-i18n.model';
import { i18nScope } from '../../../shared/scopes/i18n.scope';
import { setScope } from '../../../shared/helpers/set-scope.helper';
import { CourseStepLetter } from '../../courses/steps/course-step-letter.model';
import { CourseStepLetterScopesMap } from '../../courses/steps/interfaces/course-step-letter.interface';
import { searchScope } from '../../../shared/scopes/search.scope';

export const letterScopes: TScopes<ILetter, LetterScopesMap> = {
  i18n: i18nScope(LetterI18n),
  i18nSearch: searchScope(LetterI18n),
  courseStepLetters: () => ({
    include: {
      model: setScope<CourseStepLetter, keyof CourseStepLetterScopesMap>(CourseStepLetter, [
        'courseStep',
      ]),
    },
  }),
};
