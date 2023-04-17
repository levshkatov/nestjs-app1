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
import { TaskTypeDto, TaskTypeReqDto } from './dtos/task-type.dto';
import { TaskTypesService } from './task-types.service';

@ApiTags('tasks/types')
@Controller('types')
@SkipAuth(false)
@ApiBearerAuth()
export class TaskTypesController {
  constructor(private taskTypes: TaskTypesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех типов заданий',
  })
  @ApiOkResponse({ type: [TaskTypeDto] })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(@I18n() i18n: I18nContext): Promise<TaskTypeDto[]> {
    return this.taskTypes.getAll(i18n);
  }

  @Get('/:name')
  @ApiOperation({
    summary: '[all] Получение типа задания по названию',
  })
  @ApiOkResponse({ type: TaskTypeDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(@I18n() i18n: I18nContext, @Param() dto: TaskTypeReqDto): Promise<TaskTypeDto> {
    return this.taskTypes.getOne(i18n, dto);
  }
}
