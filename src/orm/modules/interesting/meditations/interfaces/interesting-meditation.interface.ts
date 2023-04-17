import { BS } from '../../../../shared/interfaces/scopes.interface';
import { IMedia, MediaScopesMap } from '../../../media/interfaces/media.interface';
import {
  IInterestingCategory,
  InterestingCategoryScopesMap,
} from '../../categories/interfaces/interesting-category.interface';
import { IInterestingMeditationI18n } from './interesting-meditation-i18n.interface';

export interface IInterestingMeditation {
  id: number;
  categoryId: number;
  photoId: number;
  audioFemaleId: number;
  audioMaleId: number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  i18n?: IInterestingMeditationI18n[];
  photo?: IMedia;
  audioFemale?: IMedia;
  audioMale?: IMedia;
  category?: IInterestingCategory;
}

export type InterestingMeditationScopesMap = {
  i18n: ['i18n', undefined];
  photo: ['photo', BS<IMedia, MediaScopesMap, 'photoSizes'>];
  audioFemale: ['audioFemale', undefined];
  audioMale: ['audioMale', undefined];
  category: ['category', BS<IInterestingCategory, InterestingCategoryScopesMap, 'i18n'>];
};
