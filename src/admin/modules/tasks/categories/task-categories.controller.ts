import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { ErrorDto, UnauthorizedDto } from '../../../../shared/dtos/responses.dto';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import {
  TaskCategoryDto,
  TaskCategoriesReqDto,
  TaskCategoryReqDto,
} from './dtos/task-category.dto';
import { TaskCategoriesService } from './task-categories.service';

@ApiTags('tasks/categories')
@Controller('categories')
@SkipAuth(false)
@ApiBearerAuth()
export class TaskCategoriesController {
  constructor(private taskCategories: TaskCategoriesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех категорий заданий',
  })
  @ApiOkResponse({ type: [TaskCategoryDto] })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() dto: TaskCategoriesReqDto,
  ): Promise<TaskCategoryDto[]> {
    return this.taskCategories.getAll(i18n, dto);
  }

  @Get('/simple')
  @ApiOperation({
    summary: '[all] Получение всех категорий заданий в упрощенной модели',
  })
  @ApiOkResponse({ type: [ObjectSimpleDto] })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAllSimple(@I18n() i18n: I18nContext): Promise<ObjectSimpleDto[]> {
    return this.taskCategories.getAllSimple(i18n);
  }

  @Get('/:name')
  @ApiOperation({
    summary: '[all] Получение категории задания по названию',
  })
  @ApiOkResponse({ type: TaskCategoryDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() dto: TaskCategoryReqDto,
  ): Promise<TaskCategoryDto> {
    return this.taskCategories.getOne(i18n, dto);
  }
}
