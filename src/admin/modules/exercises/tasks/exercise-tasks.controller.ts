import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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
import { ParamIndexReqDto } from '../../../../shared/dtos/param.dto';
import {
  ErrorDto,
  ForbiddenDto,
  OkDto,
  UnauthorizedDto,
} from '../../../../shared/dtos/responses.dto';
import {
  ExercisesTasksForListDto,
  ExerciseTaskCreateReqDto,
  ExerciseTaskDetailedDto,
  ExerciseTaskEditReqDto,
  ParamExerciseIdReqDto,
} from './dtos/exercise-task.dto';
import { ExerciseTasksService } from './exercise-tasks.service';

@ApiTags('exercises/:exerciseId/tasks')
@Controller(':exerciseId/tasks')
@SkipAuth(false)
@ApiBearerAuth()
export class ExerciseTasksController {
  constructor(private exerciseTasks: ExerciseTasksService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех заданий упражнения',
  })
  @ApiOkResponse({ type: ExercisesTasksForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Param() { exerciseId }: ParamExerciseIdReqDto,
  ): Promise<ExercisesTasksForListDto> {
    return this.exerciseTasks.getAll(i18n, exerciseId);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление задания упражнения',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Param() { exerciseId }: ParamExerciseIdReqDto,
    @Body() dto: ExerciseTaskCreateReqDto,
  ): Promise<OkDto> {
    return this.exerciseTasks.create(i18n, exerciseId, dto);
  }

  @Get('/:index')
  @ApiOperation({
    summary: '[all] Получение задания упражнения по индексу',
  })
  @ApiOkResponse({ type: ExerciseTaskDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { exerciseId }: ParamExerciseIdReqDto,
    @Param() { index }: ParamIndexReqDto,
  ): Promise<ExerciseTaskDetailedDto> {
    return this.exerciseTasks.getOne(i18n, exerciseId, index);
  }

  @Put('/:index')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение задания упражнения по индексу',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { exerciseId }: ParamExerciseIdReqDto,
    @Param() { index }: ParamIndexReqDto,
    @Body() dto: ExerciseTaskEditReqDto,
  ): Promise<OkDto> {
    return this.exerciseTasks.edit(i18n, exerciseId, index, dto);
  }

  @Delete('/:index')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление задания упражнения по индексу',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(
    @I18n() i18n: I18nContext,
    @Param() { exerciseId }: ParamExerciseIdReqDto,
    @Param() { index }: ParamIndexReqDto,
  ): Promise<OkDto> {
    return this.exerciseTasks.delete(i18n, exerciseId, index);
  }
}
