import { TScopes } from '../../../../shared/interfaces/scopes.interface';
import {
  CourseStepLetterScopesMap,
  ICourseStepLetter,
} from '../interfaces/course-step-letter.interface';
import { setScope } from '../../../../shared/helpers/set-scope.helper';
import { Letter } from '../../../letters/letter.model';
import { LetterScopesMap } from '../../../letters/interfaces/letter.interface';
import { CourseStep } from '../course-step.model';
import { CourseStepScopesMap } from '../interfaces/course-step.interface';

export const courseStepLetterScopes: TScopes<ICourseStepLetter, CourseStepLetterScopesMap> = {
  letter: () => ({
    include: {
      model: setScope<Letter, keyof LetterScopesMap>(Letter, ['i18n']),
    },
  }),
  courseStep: () => ({
    include: {
      model: setScope<CourseStep, keyof CourseStepScopesMap>(CourseStep, ['i18n', 'course']),
    },
  }),
};
