import { BS } from '../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../media/interfaces/media.interface';
import { CelebrityHabitScopesMap, ICelebrityHabit } from './celebrity-habit.interface';
import { ICelebrityI18n } from './celebrity-i18n.interface';

export interface ICelebrity {
  id: number;
  photoId: number;
  disabled: boolean;
  index: number | null;
  tag: string | null;
  createdAt: Date;
  updatedAt: Date;

  i18n?: ICelebrityI18n[];
  photo?: IMedia;
  celebrityHabits?: ICelebrityHabit[];
}

export type CelebrityScopesMap = {
  i18n: ['i18n', undefined];
  i18nSearch: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  celebrityHabits: ['celebrityHabits', BS<ICelebrityHabit, CelebrityHabitScopesMap, 'habit'>[]];
};
