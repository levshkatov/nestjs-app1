import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  CelebrityScopesMap,
  ICelebrity,
} from '../../../orm/modules/celebrities/interfaces/celebrity.interface';
import { BS } from '../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { HabitsMapper } from '../habits/habits.mapper';
import { MediaMapper } from '../media/media.mapper';
import { CelebrityDetailedDto, CelebrityForListDto } from './dtos/celebrity.dto';

@Injectable()
export class CelebritiesMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private habitsMapper: HabitsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toCelebrityForListDto(
    i18nContext: I18nContext,
    { id, i18n, photo }: BS<ICelebrity, CelebrityScopesMap, 'photo' | 'i18n'>,
    { isAdded }: { isAdded: boolean | undefined },
  ): CelebrityForListDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      caption: this.i18n.getValue(i18nContext, i18n, 'caption'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      isAdded,
    };
  }

  toCelebrityDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      i18n,
      photo,
      celebrityHabits,
    }: BS<ICelebrity, CelebrityScopesMap, 'photo' | 'i18n' | 'celebrityHabits'>,
    { isAdded }: { isAdded: boolean | undefined },
  ): CelebrityDetailedDto {
    return {
      id,
      name: this.i18n.getValue(i18nContext, i18n, 'name'),
      description: this.i18n.getValue(i18nContext, i18n, 'description'),
      caption: this.i18n.getValue(i18nContext, i18n, 'caption'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      habits: celebrityHabits.map(({ habit }) =>
        this.habitsMapper.toHabitForCelebrityDto(i18nContext, habit),
      ),
      isAdded,
    };
  }
}
