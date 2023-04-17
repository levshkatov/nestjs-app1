import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { UnauthorizedDto, UnsubscribedDto } from '../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import {
  LotusCalendarDto,
  LotusCalendarReqDto,
  LotusDto,
  LotusRecordDto,
  LotusReqDto,
} from './dtos/lotus.dto';
import { LotusService } from './lotus.service';

@ApiTags('lotus')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
@Roles(UserRole.mobileSubscribed)
export class LotusController {
  constructor(private lotus: LotusService) {}

  @Get('/')
  @ApiOperation({
    summary: '[subscribed] Получение лотоса пользователя',
    description: `Состояние лепестка: <br><br>
    <b>empty</b> - незакрашенный<br>
    <b>full</b> - закрашенный<br>
    <b>filling</b> - анимация закрашивания (только при animation=true)`,
  })
  @ApiOkResponse({ type: LotusDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getLotus(@I18n() i18n: I18nContext, @Query() dto: LotusReqDto, @GetUser() user: IJWTUser) {
    return this.lotus.getLotus(i18n, dto, user);
  }

  @Get('/record')
  @ApiOperation({
    summary: '[subscribed] Получение рекорда по лотосу',
  })
  @ApiOkResponse({ type: LotusRecordDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getRecord(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser) {
    return this.lotus.getRecord(i18n, user);
  }

  @Get('/calendar')
  @ApiOperation({
    summary: '[subscribed] Получение календаря',
  })
  @ApiOkResponse({ type: [LotusCalendarDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getCalendar(
    @I18n() i18n: I18nContext,
    @Query() dto: LotusCalendarReqDto,
    @GetUser() user: IJWTUser,
  ) {
    return this.lotus.getCalendar(i18n, dto, user);
  }
}
