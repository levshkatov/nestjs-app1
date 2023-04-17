import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { ForbiddenDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { TaskDto, TaskWithoutContentDto } from './dtos/task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
@Roles(UserRole.mobileAdmin)
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get('/')
  @ApiOperation({
    summary: '[admin] Получение всех заданий',
  })
  @ApiOkResponse({ type: [TaskWithoutContentDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  getAll(@I18n() i18n: I18nContext): Promise<TaskWithoutContentDto[]> {
    return this.tasks.getAll(i18n);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[admin] Подробный просмотр задания по id',
  })
  @ApiOkResponse({ type: TaskDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  getOne(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<TaskDto> {
    return this.tasks.getOne(i18n, id);
  }
}
