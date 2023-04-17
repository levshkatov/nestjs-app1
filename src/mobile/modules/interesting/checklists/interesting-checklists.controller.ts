import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { ParamIdReqDto } from '../../../../shared/dtos/param.dto';
import { UnauthorizedDto, UnsubscribedDto, OkDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import {
  InterestingChecklistGroupByCategoryDto,
  InterestingChecklistDetailedDto,
  UserInterestingChecklistDataReqDto,
} from './dtos/interesting-checklist.dto';
import { InterestingChecklistsService } from './interesting-checklists.service';

@ApiTags('interesting/checklists')
@Controller('')
@SkipAuth()
export class InterestingChecklistsController {
  constructor(private checklists: InterestingChecklistsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение списка объектов блока "Чек-листы"',
  })
  @ApiOkResponse({ type: [InterestingChecklistGroupByCategoryDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(@I18n() i18n: I18nContext): Promise<InterestingChecklistGroupByCategoryDto[]> {
    return this.checklists.getAll(i18n);
  }

  @Get('/:id')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение объекта блока "Чек-листы"',
    description: 'Первый объект из списка можно просмотреть без подписки и авторизации',
  })
  @ApiOkResponse({ type: InterestingChecklistDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<InterestingChecklistDetailedDto> {
    return this.checklists.getOne(i18n, id, user);
  }

  @Post('/:id')
  @ApiBearerAuth()
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiOperation({
    summary: '[subscribed] Добавление пользовательских данных для чеклиста',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  saveData(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: UserInterestingChecklistDataReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.checklists.saveData(i18n, id, dto, user);
  }
}
