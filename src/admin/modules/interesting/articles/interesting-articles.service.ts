import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingArticleOrmService } from '../../../../orm/modules/interesting/articles/interesting-article-orm.service';
import { IInterestingArticle } from '../../../../orm/modules/interesting/articles/interfaces/interesting-article.interface';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import { MediaOrmService } from '../../../../orm/modules/media/media-orm.service';
import { NotificationType } from '../../../../orm/modules/notifications/interfaces/notification-type.enum';
import { TaskCategoryName } from '../../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import { NotificationsService } from '../../../../shared/modules/notifications/notifications.service';
import { InterestingService } from '../interesting.service';
import {
  InterestingArticlesForListDto,
  InterestingArticleCreateReqDto,
  InterestingArticleDetailedDto,
  InterestingArticleEditReqDto,
  InterestingArticlesReqDto,
} from './dtos/interesting-article.dto';
import { InterestingArticlesMapper } from './interesting-articles.mapper';

@Injectable()
export class InterestingArticlesService {
  constructor(
    private i18n: I18nHelperService,
    private articles: InterestingArticleOrmService,
    private articlesMapper: InterestingArticlesMapper,
    private media: MediaOrmService,
    private interesting: InterestingService,
    private notifications: NotificationsService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingArticlesForListDto> {
    const {
      pages,
      total,
      rows: articles,
    } = await this.articles.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['i18n', 'photo', 'taskSimple'],
      `"InterestingArticle"."id"`,
    );

    return {
      pages,
      total,
      interestingArticles: articles.map((article) =>
        this.articlesMapper.toInterestingArticleForListDto(i18n, article),
      ),
    };
  }

  async create(
    i18n: I18nContext,
    { photoId, taskId, translations }: InterestingArticleCreateReqDto,
  ): Promise<OkDto> {
    this.i18n.checkFallbackLang(i18n, translations);

    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    await this.interesting.checkTask(i18n, 'create', taskId, TaskCategoryName.article);

    const article = await this.articles.create({ disabled: true, photoId, taskId });

    await this.articles.createI18n(
      this.i18n.createTranslations(translations, { interestingArticleId: article.id }),
    );

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingArticleDetailedDto> {
    const article = await this.articles.getOneFromAll({ where: { id } }, [
      'i18n',
      'photo',
      'taskSimple',
    ]);
    if (!article) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    return this.articlesMapper.toInterestingArticleDetailedDto(i18n, article);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { photoId, taskId, translations, disabled }: InterestingArticleEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const article = await this.articles.getOneFromAll({ where: { id } });
    if (!article) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    this.i18n.checkFallbackLang(i18n, translations);

    const articleUpdate: Partial<GetRequired<IInterestingArticle>> = {};

    if (photoId !== article.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      articleUpdate.photoId = photoId;
    }

    if (taskId !== article.taskId) {
      await this.interesting.checkTask(i18n, 'edit', taskId, TaskCategoryName.article);
      articleUpdate.taskId = taskId;
    }

    if (disabled !== undefined && disabled !== article.disabled && role === UserRole.webAdmin) {
      if (disabled === false) {
        this.notifications.sendToAllUsers(NotificationType.newArticle, id);
      }
      articleUpdate.disabled = disabled;
    }

    if (Object.keys(articleUpdate).length) {
      await this.articles.update(articleUpdate, { where: { id } });
    }

    await this.articles.destroyI18n({ where: { interestingArticleId: id } });
    await this.articles.createI18n(
      this.i18n.createTranslations(translations, { interestingArticleId: id }),
    );

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    if ((await this.articles.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
