import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingCategoryOrmService } from '../../../orm/modules/interesting/categories/interesting-category-orm.service';
import { InterestingCategoryType } from '../../../orm/modules/interesting/categories/interfaces/interesting-category-type.enum';
import { TaskCategoryName } from '../../../orm/modules/tasks/categories/interfaces/task-category.enum';
import { TaskOrmService } from '../../../orm/modules/tasks/task-orm.service';
import { createError, ErrorTitle } from '../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';

@Injectable()
export class InterestingService {
  constructor(
    private i18n: I18nHelperService,
    private tasks: TaskOrmService,
    private categories: InterestingCategoryOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async checkTask(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    taskId: number,
    categoryName: TaskCategoryName,
  ) {
    const task = await this.tasks.getOne({ where: { id: taskId } });
    if (!task) {
      throw createError(i18n, errorTitle, 'tasks.notFound');
    }
    if (task.categoryName !== categoryName) {
      throw createError(
        i18n,
        errorTitle,
        null,
        i18n.t('errors.interesting.wrongTaskCategory', { args: { categoryName } }),
      );
    }
  }

  async checkCategory(
    i18n: I18nContext,
    errorTitle: ErrorTitle,
    categoryId: number,
    type: InterestingCategoryType,
  ) {
    const category = await this.categories.getOne({ where: { id: categoryId } });
    if (!category) {
      throw createError(i18n, errorTitle, 'interesting.categoryNotFound');
    }
    if (category.type !== type) {
      throw createError(
        i18n,
        errorTitle,
        null,
        i18n.t('errors.interesting.wrongCategory', { args: { type } }),
      );
    }
  }
}
