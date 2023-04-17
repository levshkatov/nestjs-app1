import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingArticle } from './interesting-article.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingArticleScopesMap } from './interfaces/interesting-article.interface';
import { InterestingArticleI18n } from './interesting-article-i18n.model';
import { BulkCreateOptions, DestroyOptions } from 'sequelize';
import { CreationAttributes, Attributes } from 'sequelize/types';

@Injectable()
export class InterestingArticleOrmService extends MainOrmService<
  InterestingArticle,
  InterestingArticleScopesMap
> {
  constructor(
    @InjectModel(InterestingArticle)
    private interestingArticle: typeof InterestingArticle,

    @InjectModel(InterestingArticleI18n)
    private interestingArticleI18n: typeof InterestingArticleI18n,
  ) {
    super(interestingArticle);
    logClassName(this.constructor.name, __filename);
  }

  async createI18n(
    records: ReadonlyArray<CreationAttributes<InterestingArticleI18n>>,
    options?: BulkCreateOptions<Attributes<InterestingArticleI18n>>,
  ): Promise<Attributes<InterestingArticleI18n>[]> {
    return MainOrmService.bulkCreate(this.interestingArticleI18n, records, options);
  }

  async destroyI18n(options?: DestroyOptions<Attributes<InterestingArticleI18n>>): Promise<number> {
    return MainOrmService.destroy(this.interestingArticleI18n, options);
  }
}
