import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { UserClaimReqDto } from './dtos/user-claim.dto';
import { UserClaimsService } from './user-claims.service';

@ApiTags('users/claims')
@Controller('claims')
@SkipAuth(false)
@ApiBearerAuth()
export class UserClaimsController {
  constructor(private userClaims: UserClaimsService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Отправка формы обратной связи',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  post(@I18n() i18n: I18nContext, @Body() dto: UserClaimReqDto, @GetUser() user: IJWTUser) {
    return this.userClaims.post(i18n, dto, user);
  }
}
