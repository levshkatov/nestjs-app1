import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { InterestingArticlesMapper } from './interesting-articles.mapper';
import {
  InterestingArticleDetailedDto,
  InterestingArticleForListDto,
} from './dtos/interesting-article.dto';
import { InterestingArticleOrmService } from '../../../../orm/modules/interesting/articles/interesting-article-orm.service';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { checkSubscription } from '../../../../shared/helpers/check-subscription.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class InterestingArticlesService {
  constructor(
    private popup: PopUpService,
    private articles: InterestingArticleOrmService,
    private articlesMapper: InterestingArticlesMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<InterestingArticleForListDto[]> {
    return (
      await this.articles.getAll({ where: { disabled: false }, order: [['id', 'ASC']] }, [
        'i18n',
        'photo',
      ])
    ).map((article) => this.articlesMapper.toInterestingArticleForListDto(i18n, article));
  }

  async getOne(
    i18n: I18nContext,
    id: number,
    user?: IJWTUser,
  ): Promise<InterestingArticleDetailedDto> {
    const article = await this.articles.getOneFromAll({ where: { id, disabled: false } }, ['task']);
    if (!article) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    const firstArticle = await this.articles.getOneFromAll(
      { where: { disabled: false }, order: [['id', 'ASC']] },
      ['task'],
    );
    if (!firstArticle) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    if (firstArticle.id === id) {
      return this.articlesMapper.toInterestingArticleDetailedDto(i18n, firstArticle);
    }

    checkSubscription(user);

    return this.articlesMapper.toInterestingArticleDetailedDto(i18n, article);
  }
}
