import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { HabitCategoriesMapper } from './habit-categories.mapper';
import { HabitCategoryDto } from './dtos/habit-category.dto';
import { HabitCategoryOrmService } from '../../../../orm/modules/habits/categories/habit-category-orm.service';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class HabitCategoriesService {
  constructor(
    private popup: PopUpService,
    private categories: HabitCategoryOrmService,
    private categoriesMapper: HabitCategoriesMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<HabitCategoryDto[]> {
    return (await this.categories.getAll({ order: [['id', 'ASC']] }, ['i18n', 'photo'])).map(
      (category) => this.categoriesMapper.toHabitCategoryDto(i18n, category),
    );
  }
}
