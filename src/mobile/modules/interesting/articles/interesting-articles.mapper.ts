import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import {
  IInterestingArticle,
  InterestingArticleScopesMap,
} from '../../../../orm/modules/interesting/articles/interfaces/interesting-article.interface';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { MediaMapper } from '../../media/media.mapper';
import { TasksMapper } from '../../tasks/tasks.mapper';
import {
  InterestingArticleDetailedDto,
  InterestingArticleForListDto,
} from './dtos/interesting-article.dto';

@Injectable()
export class InterestingArticlesMapper {
  constructor(
    private i18n: I18nHelperService,
    private mediaMapper: MediaMapper,
    private tasksMapper: TasksMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  toInterestingArticleForListDto(
    i18nContext: I18nContext,
    { id, i18n, photo }: BS<IInterestingArticle, InterestingArticleScopesMap, 'i18n' | 'photo'>,
  ): InterestingArticleForListDto {
    return {
      id,
      title: this.i18n.getValue(i18nContext, i18n, 'title'),
      photo: this.mediaMapper.toPhotoDto(i18nContext, photo),
    };
  }

  toInterestingArticleDetailedDto(
    i18nContext: I18nContext,
    {
      id: interestingArticleId,
      task,
    }: BS<IInterestingArticle, InterestingArticleScopesMap, 'task'>,
  ): InterestingArticleDetailedDto {
    return {
      interestingArticleId,
      task: this.tasksMapper.toTaskDto(i18nContext, task),
    };
  }
}
