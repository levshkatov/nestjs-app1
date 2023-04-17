import { BS } from '../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';
import { CourseScopesMap, ICourse } from '../../interfaces/course.interface';
import {
  ICourseStepExercise,
  CourseStepExerciseScopesMap,
} from '../exercises/interfaces/course-step-exercise.interface';
import { ICourseStepI18n } from './course-step-i18n.interface';
import { CourseStepLetterScopesMap, ICourseStepLetter } from './course-step-letter.interface';

export interface ICourseStep {
  id: number;
  courseId: number;
  index: number;
  photoId: number | null;
  createdAt: Date;
  updatedAt: Date;

  i18n?: ICourseStepI18n[];
  photo?: IMedia;
  courseStepLetters?: ICourseStepLetter[];
  courseStepExercises?: ICourseStepExercise[];
  course?: ICourse;
}

export type CourseStepScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'> | null];
  courseStepLetters: [
    'courseStepLetters',
    BS<ICourseStepLetter, CourseStepLetterScopesMap, 'letter'>[],
  ];
  courseStepExercises: [
    'courseStepExercises',
    BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exercise'>[],
  ];
  courseStepExercisesNoTasks: [
    'courseStepExercises',
    BS<ICourseStepExercise, CourseStepExerciseScopesMap, 'exerciseNoTasks'>[],
  ];
  course: ['course', BS<ICourse, CourseScopesMap, 'i18n'>];
};
