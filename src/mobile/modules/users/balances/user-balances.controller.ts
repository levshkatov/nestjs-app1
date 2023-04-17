import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { UnauthorizedDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import { UserBalanceDto, UserIconsDto } from './dtos/user-balance.dto';
import { UserBalancesService } from './user-balances.service';

@ApiTags('users/balances')
@Controller('balances')
@SkipAuth(false)
@ApiBearerAuth()
export class UserBalancesController {
  constructor(private userBalances: UserBalancesService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение баланса пользователя',
  })
  @ApiOkResponse({ type: UserBalanceDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  get(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserBalanceDto> {
    return this.userBalances.get(i18n, user);
  }

  @Get('/icons')
  @ApiOperation({
    summary: 'Получение "Мои я"',
  })
  @ApiOkResponse({ type: UserIconsDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  getIcons(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserIconsDto> {
    return this.userBalances.getIcons(i18n, user);
  }
}
