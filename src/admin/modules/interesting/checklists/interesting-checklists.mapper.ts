import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IInterestingChecklistI18n } from '../../../../orm/modules/interesting/checklists/interfaces/interesting-checklist-i18n.interface';
import {
  IInterestingChecklist,
  InterestingChecklistScopesMap,
} from '../../../../orm/modules/interesting/checklists/interfaces/interesting-checklist.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../../linked-objects.mapper';
import { MediaMapper } from '../../media/media.mapper';
import {
  InterestingChecklistDetailedDto,
  InterestingChecklistI18nDto,
  InterestingChecklistForListDto,
} from './dtos/interesting-checklist.dto';

@Injectable()
export class InterestingChecklistsMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private linkedMapper: LinkedObjectsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingChecklistForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      i18n,
      category,
      photo,
      task,
    }: BS<
      IInterestingChecklist,
      InterestingChecklistScopesMap,
      'i18n' | 'photo' | 'category' | 'taskSimple'
    >,
  ): InterestingChecklistForListDto {
    return {
      id,
      disabled,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      category: this.linkedMapper.toInterestingCategoryLinkedDto(i18nContext, category, false),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
    };
  }

  toInterestingChecklistDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      i18n,
      category,
      photo,
      task,
    }: BS<
      IInterestingChecklist,
      InterestingChecklistScopesMap,
      'i18n' | 'photo' | 'category' | 'taskSimple'
    >,
    disclaimer?: string,
  ): InterestingChecklistDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      category: this.linkedMapper.toInterestingCategoryLinkedDto(i18nContext, category, false),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
      translations: i18n.map((el) => this.toInterestingChecklistI18nDto(i18nContext, el)),
    };
  }

  toInterestingChecklistI18nDto(
    i18nContext: I18nContext,
    { lang, title }: IInterestingChecklistI18n,
  ): InterestingChecklistI18nDto {
    return {
      lang,
      title,
    };
  }
}
