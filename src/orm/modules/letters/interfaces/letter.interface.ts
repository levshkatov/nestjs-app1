import { BS } from '../../../shared/interfaces/scopes.interface';
import {
  CourseStepLetterScopesMap,
  ICourseStepLetter,
} from '../../courses/steps/interfaces/course-step-letter.interface';
import { ILetterI18n } from './letter-i18n.interface';
import { LetterTrigger } from './letter-trigger.enum';

export interface ILetter {
  id: number;
  trigger: LetterTrigger;
  createdAt: Date;
  updatedAt: Date;

  i18n?: ILetterI18n[];
  courseStepLetters?: ICourseStepLetter[];
}

export type LetterScopesMap = {
  i18n: ['i18n', undefined];
  i18nSearch: ['i18n', undefined];
  courseStepLetters: [
    'courseStepLetters',
    BS<ICourseStepLetter, CourseStepLetterScopesMap, 'courseStep'>[],
  ];
};
