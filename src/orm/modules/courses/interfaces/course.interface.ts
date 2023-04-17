import { BS } from '../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../media/interfaces/media.interface';
import { CourseStepScopesMap, ICourseStep } from '../steps/interfaces/course-step.interface';
import { CourseHabitScopesMap, ICourseHabit } from './course-habit.interface';
import { ICourseI18n } from './course-i18n.interface';
import { CourseType } from './course-type.enum';

export interface ICourse {
  id: number;
  photoId: number;
  photoInactiveId: number | null;
  type: CourseType;
  disabled: boolean;
  index: number | null;
  tag: string | null;
  createdAt: Date;
  updatedAt: Date;

  i18n?: ICourseI18n[];
  photo?: IMedia;
  photoInactive?: IMedia;
  courseHabits?: ICourseHabit[];
  steps?: ICourseStep[];
}

export type CourseScopesMap = {
  i18n: ['i18n', undefined];
  i18nSearch: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  photoInactive: ['photoInactive', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  courseHabits: ['courseHabits', BS<ICourseHabit, CourseHabitScopesMap, 'habit'>[]];
  steps: [
    'steps',
    BS<
      ICourseStep,
      CourseStepScopesMap,
      'i18n' | 'photo' | 'courseStepExercises' | 'courseStepLetters'
    >[],
  ];
  stepsSimple: ['steps', undefined];
};
