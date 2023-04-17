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
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { ErrorDto, ForbiddenDto, OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { paginate } from '../../../shared/helpers/paginate.helper';
import {
  ExercisesForListDto,
  ExerciseCreateReqDto,
  ExerciseDetailedDto,
  ExerciseEditReqDto,
  ExercisesReqDto,
} from './dtos/exercise.dto';
import { ExercisesService } from './exercises.service';

@ApiTags('exercises')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class ExercisesController {
  constructor(private exercises: ExercisesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех упражнений',
  })
  @ApiOkResponse({ type: ExercisesForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
    @Query() dto: ExercisesReqDto,
  ): Promise<ExercisesForListDto> {
    return this.exercises.getAll(i18n, paginate(page), dto);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление упражнения',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(@I18n() i18n: I18nContext, @Body() dto: ExerciseCreateReqDto): Promise<OkDto> {
    return this.exercises.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение упражнения по id',
  })
  @ApiOkResponse({ type: ExerciseDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<ExerciseDetailedDto> {
    return this.exercises.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение упражнения по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: ExerciseEditReqDto,
  ): Promise<OkDto> {
    return this.exercises.edit(i18n, id, dto);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление упражнения по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.exercises.delete(i18n, id);
  }
}
