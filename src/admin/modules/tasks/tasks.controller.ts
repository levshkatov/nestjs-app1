import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';

import { ErrorDto, ForbiddenDto, OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { paginate } from '../../../shared/helpers/paginate.helper';
import { TaskErrorDto } from '../../../shared/modules/tasks/dtos/task.dto';
import {
  TaskCreateReqDto,
  TaskDetailedDto,
  TaskEditReqDto,
  TasksForListDto,
  TasksReqDto,
} from './dtos/task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех заданий',
  })
  @ApiOkResponse({ type: TasksForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
    @Query() dto: TasksReqDto,
  ): Promise<TasksForListDto> {
    return this.tasks.getAll(i18n, paginate(page), dto);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление задания',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiConflictResponse({ type: [TaskErrorDto] })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Body() dto: TaskCreateReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OkDto | TaskErrorDto[]> {
    const retDto = await this.tasks.create(i18n, dto);

    if (Array.isArray(retDto)) {
      res.status(HttpStatus.CONFLICT);
    } else {
      res.status(HttpStatus.CREATED);
    }

    return retDto;
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение задания по id',
  })
  @ApiOkResponse({ type: TaskDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<TaskDetailedDto> {
    return this.tasks.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение задания по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiConflictResponse({ type: [TaskErrorDto] })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: TaskEditReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OkDto | TaskErrorDto[]> {
    const retDto = await this.tasks.edit(i18n, id, dto);

    if (Array.isArray(retDto)) {
      res.status(HttpStatus.CONFLICT);
    } else {
      res.status(HttpStatus.OK);
    }

    return retDto;
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление знаменитости по id',
    description: 'Если задание связано с другими объектами, то удалить его нельзя',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.tasks.delete(i18n, id);
  }
}
