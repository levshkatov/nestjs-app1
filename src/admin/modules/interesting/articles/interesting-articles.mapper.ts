import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IInterestingArticleI18n } from '../../../../orm/modules/interesting/articles/interfaces/interesting-article-i18n.interface';
import {
  IInterestingArticle,
  InterestingArticleScopesMap,
} from '../../../../orm/modules/interesting/articles/interfaces/interesting-article.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { LinkedObjectsMapper } from '../../linked-objects.mapper';
import { MediaMapper } from '../../media/media.mapper';
import {
  InterestingArticleDetailedDto,
  InterestingArticleI18nDto,
  InterestingArticleForListDto,
} from './dtos/interesting-article.dto';

@Injectable()
export class InterestingArticlesMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private linkedMapper: LinkedObjectsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingArticleForListDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      i18n,
      photo,
      task,
    }: BS<IInterestingArticle, InterestingArticleScopesMap, 'i18n' | 'photo' | 'taskSimple'>,
  ): InterestingArticleForListDto {
    return {
      id,
      disabled,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
    };
  }

  toInterestingArticleDetailedDto(
    i18nContext: I18nContext,
    {
      id,
      disabled,
      i18n,
      photo,
      task,
    }: BS<IInterestingArticle, InterestingArticleScopesMap, 'i18n' | 'photo' | 'taskSimple'>,
    disclaimer?: string,
  ): InterestingArticleDetailedDto {
    return {
      disclaimer,
      id,
      disabled,
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
      task: this.linkedMapper.toTaskLinkedDto(i18nContext, task, false),
      translations: i18n.map((el) => this.toInterestingArticleI18nDto(i18nContext, el)),
    };
  }

  toInterestingArticleI18nDto(
    i18nContext: I18nContext,
    { lang, title }: IInterestingArticleI18n,
  ): InterestingArticleI18nDto {
    return {
      lang,
      title,
    };
  }
}
