import { BS } from '../../../../shared/interfaces/scopes.interface';
import { ILetter, LetterScopesMap } from '../../../letters/interfaces/letter.interface';
import { CourseStepScopesMap, ICourseStep } from './course-step.interface';

export interface ICourseStepLetter {
  courseStepId: number;
  letterId: number;
  createdAt: Date;
  updatedAt: Date;

  letter?: ILetter;
  courseStep?: ICourseStep;
}

export type CourseStepLetterScopesMap = {
  letter: ['letter', BS<ILetter, LetterScopesMap, 'i18n'>];
  courseStep: ['courseStep', BS<ICourseStep, CourseStepScopesMap, 'i18n' | 'course'>];
};
