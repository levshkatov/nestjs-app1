import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { UnauthorizedDto, UnsubscribedDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import { UserWaterBalanceDto } from './dtos/user-water-balance.dto';
import { MAX_WATER_BALANCE } from './interfaces/user-water-balance.constants';
import { UserWaterBalanceService } from './user-water-balance.service';

@ApiTags('users/waterBalance')
@Controller('waterBalance')
@SkipAuth(false)
@ApiBearerAuth()
@Roles(UserRole.mobileSubscribed)
export class UserWaterBalanceController {
  constructor(private waterBalance: UserWaterBalanceService) {}

  @Get('/')
  @ApiOperation({
    summary: '[subscribed] Получение текущего водного баланса',
  })
  @ApiOkResponse({ type: UserWaterBalanceDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  get(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserWaterBalanceDto> {
    return this.waterBalance.get(i18n, user);
  }

  @Post('/')
  @ApiOperation({
    summary: `[subscribed] Увеличение водного баланса на 1 (максимум: ${MAX_WATER_BALANCE})`,
  })
  @ApiCreatedResponse({ type: UserWaterBalanceDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  increase(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserWaterBalanceDto> {
    return this.waterBalance.increase(i18n, user);
  }
}
