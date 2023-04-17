import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AdminConfig } from '../../../config/interfaces/admin';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { ErrorDto, OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { clearToken, setToken } from '../../shared/helpers/cookies.helper';
import { AuthService } from './auth.service';
import { RefreshTokenReqDto, UserWithSessionIdDto } from './dtos/jwt.dto';
import { SignInReqDto } from './dtos/sign-in.dto';
import { SignOutReqDto } from './dtos/sign-out.dto';

@ApiTags('auth')
@Controller('')
@SkipAuth()
export class AuthController {
  constructor(private auth: AuthService, private config: ConfigService) {}

  private configAdmin = this.config.get<AdminConfig>('admin')!;

  @Post('/signin')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Авторизация пользователя',
  })
  @ApiOkResponse({ type: UserWithSessionIdDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  async signIn(
    @I18n() i18n: I18nContext,
    @Body() dto: SignInReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserWithSessionIdDto> {
    const { accessToken, refreshToken, sessionId, user } = await this.auth.signIn(i18n, dto);
    setToken('refreshToken', res, this.configAdmin, refreshToken);
    setToken('accessToken', res, this.configAdmin, accessToken);
    return { sessionId, user };
  }

  @Post('/signout')
  @SkipAuth(false)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Выход из учетной записи',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async signOut(
    @I18n() i18n: I18nContext,
    @Body() dto: SignOutReqDto,
    @GetUser() user: IJWTUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OkDto> {
    const response = await this.auth.signOut(i18n, dto, user, req.signedCookies?.refreshToken);
    clearToken('accessToken', res, this.configAdmin);
    clearToken('refreshToken', res, this.configAdmin);
    return response;
  }

  @Post('/refreshTokens')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Получение новых токенов',
  })
  @ApiOkResponse({ type: UserWithSessionIdDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  async refreshTokens(
    @I18n() i18n: I18nContext,
    @Body() dto: RefreshTokenReqDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserWithSessionIdDto> {
    const { accessToken, refreshToken, sessionId, user } = await this.auth.refreshTokens(
      i18n,
      dto,
      req.signedCookies?.refreshToken,
    );
    setToken('refreshToken', res, this.configAdmin, refreshToken);
    setToken('accessToken', res, this.configAdmin, accessToken);
    return { sessionId, user };
  }
}
