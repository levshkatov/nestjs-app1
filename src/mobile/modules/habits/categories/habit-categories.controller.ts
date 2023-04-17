import { Controller, Get } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import { HabitCategoryDto } from './dtos/habit-category.dto';
import { HabitCategoriesService } from './habit-categories.service';

@ApiTags('habits/categories')
@Controller('categories')
@SkipAuth()
export class HabitCategoriesController {
  constructor(private categories: HabitCategoriesService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение всех категорий привычек',
  })
  @ApiOkResponse({ type: [HabitCategoryDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(@I18n() i18n: I18nContext): Promise<HabitCategoryDto[]> {
    return this.categories.getAll(i18n);
  }
}
