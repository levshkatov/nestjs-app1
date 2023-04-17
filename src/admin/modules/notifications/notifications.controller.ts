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
  NotificationsForListDto,
  NotificationCreateReqDto,
  NotificationDetailedDto,
  NotificationEditReqDto,
  NotificationsReqDto,
} from './dtos/notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
@Roles(UserRole.webAdmin)
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get('/')
  @ApiOperation({
    summary: '[webAdmin] Получение всех уведомлений',
  })
  @ApiOkResponse({ type: NotificationsForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
    @Query() dto: NotificationsReqDto,
  ): Promise<NotificationsForListDto> {
    return this.notifications.getAll(i18n, paginate(page), dto);
  }

  @Post('/')
  @ApiOperation({
    summary: '[webAdmin] Добавление уведомления',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(@I18n() i18n: I18nContext, @Body() dto: NotificationCreateReqDto): Promise<OkDto> {
    return this.notifications.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[webAdmin] Получение уведомления по id',
  })
  @ApiOkResponse({ type: NotificationDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<NotificationDetailedDto> {
    return this.notifications.getOne(i18n, id);
  }

  @Put('/:id')
  @ApiOperation({
    summary: '[webAdmin] Изменение уведомления по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: NotificationEditReqDto,
  ): Promise<OkDto> {
    return this.notifications.edit(i18n, id, dto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: '[webAdmin] Удаление уведомления по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.notifications.delete(i18n, id);
  }
}
