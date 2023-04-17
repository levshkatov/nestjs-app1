import { Body, Controller, Delete, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { OkDto, UnauthorizedDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import { AuthTokensService } from './auth-tokens.service';
import { FcmCreateReqDto, FcmDeleteReqDto } from './dtos/auth-token.dto';

@ApiTags('auth/tokens')
@Controller('tokens')
@SkipAuth(false)
@ApiBearerAuth()
export class AuthTokensController {
  constructor(private tokens: AuthTokensService) {}

  @Post('/fcm')
  @ApiOperation({
    summary: 'Добавление FCM токена',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  saveData(
    @I18n() i18n: I18nContext,
    @Body() dto: FcmCreateReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.tokens.create(i18n, dto, user);
  }

  @Delete('/fcm')
  @ApiOperation({
    summary: 'Удаление FCM токена',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  delete(
    @I18n() i18n: I18nContext,
    @Body() dto: FcmDeleteReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.tokens.delete(i18n, dto, user);
  }
}
