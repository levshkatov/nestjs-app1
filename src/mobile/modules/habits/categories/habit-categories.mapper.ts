import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IHabitCategory,
  HabitCategoryScopesMap,
} from '../../../../orm/modules/habits/categories/interfaces/habit-category.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { HabitCategoryDto } from './dtos/habit-category.dto';

@Injectable()
export class HabitCategoriesMapper {
  constructor(private i18n: I18nHelperService, private mediaMapper: MediaMapper) {
    logClassName(this.constructor.name, __filename);
  }

  toHabitCategoryDto(
    i18nContext: I18nContext,
    { id, i18n, photo }: BS<IHabitCategory, HabitCategoryScopesMap, 'i18n' | 'photo'>,
  ): HabitCategoryDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }
}
