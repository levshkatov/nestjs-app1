import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../../shared/dtos/param.dto';
import {
  ErrorDto,
  ForbiddenDto,
  OkDto,
  UnauthorizedDto,
} from '../../../../shared/dtos/responses.dto';
import { paginate } from '../../../../shared/helpers/paginate.helper';
import { ObjectSimpleDto } from '../../../shared/dtos/object-simple.dto';
import {
  HabitCategoriesForListDto,
  HabitCategoryCreateReqDto,
  HabitCategoryDetailedDto,
  HabitCategoryEditReqDto,
} from './dtos/habit-category.dto';
import { HabitCategoriesService } from './habit-categories.service';

@ApiTags('habits/categories')
@Controller('categories')
@SkipAuth(false)
@ApiBearerAuth()
export class HabitCategoriesController {
  constructor(private categories: HabitCategoriesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех категорий привычек',
  })
  @ApiOkResponse({ type: HabitCategoriesForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
  ): Promise<HabitCategoriesForListDto> {
    return this.categories.getAll(i18n, paginate(page));
  }

  @Post('/')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Добавление категории привычек',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(@I18n() i18n: I18nContext, @Body() dto: HabitCategoryCreateReqDto): Promise<OkDto> {
    return this.categories.create(i18n, dto);
  }

  @Get('/simple')
  @ApiOperation({
    summary: '[all] Получение всех категорий привычек в упрощенной модели',
  })
  @ApiOkResponse({ type: [ObjectSimpleDto] })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAllSimple(@I18n() i18n: I18nContext): Promise<ObjectSimpleDto[]> {
    return this.categories.getAllSimple(i18n);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение категории привычек по id',
  })
  @ApiOkResponse({ type: HabitCategoryDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<HabitCategoryDetailedDto> {
    return this.categories.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Изменение категории привычек по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: HabitCategoryEditReqDto,
  ): Promise<OkDto> {
    return this.categories.edit(i18n, id, dto);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление категории привычек по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.categories.delete(i18n, id);
  }
}
