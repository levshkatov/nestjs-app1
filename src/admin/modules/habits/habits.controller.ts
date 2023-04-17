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
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { ErrorDto, ForbiddenDto, OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { paginate } from '../../../shared/helpers/paginate.helper';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { ObjectSimpleDto } from '../../shared/dtos/object-simple.dto';
import {
  HabitCreateReqDto,
  HabitDetailedDto,
  HabitEditReqDto,
  HabitsForListDto,
  HabitsReqDto,
  HabitsSimpleReqDto,
} from './dtos/habit.dto';
import { HabitsService } from './habits.service';

@ApiTags('habits')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class HabitsController {
  constructor(private habits: HabitsService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех привычек',
  })
  @ApiOkResponse({ type: HabitsForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
    @Query() dto: HabitsReqDto,
  ): Promise<HabitsForListDto> {
    return this.habits.getAll(i18n, paginate(page), dto);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление привычки',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(@I18n() i18n: I18nContext, @Body() dto: HabitCreateReqDto): Promise<OkDto> {
    return this.habits.create(i18n, dto);
  }

  @Get('/simple')
  @ApiOperation({
    summary: '[all] Получение всех привычек в упрощенной модели',
  })
  @ApiOkResponse({ type: [ObjectSimpleDto] })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAllSimple(
    @I18n() i18n: I18nContext,
    @Query() dto: HabitsSimpleReqDto,
  ): Promise<ObjectSimpleDto[]> {
    return this.habits.getAllSimple(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение привычки по id',
  })
  @ApiOkResponse({ type: HabitDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<HabitDetailedDto> {
    return this.habits.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение привычки по id',
    description: 'webEditor может изменить все поля, кроме *disabled*',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: HabitEditReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.habits.edit(i18n, id, dto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление привычки по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.habits.delete(i18n, id);
  }
}
