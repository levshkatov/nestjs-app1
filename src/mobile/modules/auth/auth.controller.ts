import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { UserDto } from '../../shared/dtos/user.dto';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { AuthService } from './auth.service';
import { UserWithTokensDto, RefreshTokenReqDto } from './dtos/jwt.dto';
import { SignInReqDto } from './dtos/sign-in.dto';
import { SignUpReqDto } from './dtos/sign-up.dto';
import { VerifyCodeReqDto, VerifyCodeNewPhoneReqDto } from './dtos/verify-code.dto';
import { SignInAppleReqDto } from './socials/apple/dtos/sign-in-apple.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { SignOutReqDto } from './dtos/sign-out.dto';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';

@ApiTags('auth')
@Controller('')
@SkipAuth()
export class AuthController {
  constructor(private auth: AuthService) {}

  // @Post('/signup')
  // @HttpCode(200)
  // @ApiOperation({
  //   summary: 'Регистрация пользователя',
  // })
  // @ApiOkResponse({ type: OkDto })
  // @ApiBadRequestResponse({ type: PopUpDto })
  // signUp(@I18n() i18n: I18nContext, @Body() dto: SignUpReqDto): Promise<OkDto> {
  //   return this.auth.signUp(i18n, dto);
  // }

  // @Post('/signin')
  // @HttpCode(200)
  // @ApiOperation({
  //   deprecated: true,
  //   summary: 'Авторизация пользователя',
  // })
  // @ApiOkResponse({ type: OkDto })
  // @ApiBadRequestResponse({ type: PopUpDto })
  // signIn(@I18n() i18n: I18nContext, @Body() dto: SignInReqDto): Promise<OkDto> {
  //   return this.auth.signIn(i18n, dto);
  // }

  @Post('/signin/apple')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Авторизация пользователя с помощью Sign in with Apple',
  })
  @ApiOkResponse({ type: UserWithTokensDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  signInApple(
    @I18n() i18n: I18nContext,
    @Body() dto: SignInAppleReqDto,
  ): Promise<UserWithTokensDto> {
    return this.auth.signInApple(i18n, dto);
  }

  @Post('/signout')
  @SkipAuth(false)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Выход из учетной записи',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  signOut(
    @I18n() i18n: I18nContext,
    @Body() dto: SignOutReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.auth.signOut(i18n, dto, user);
  }

  // @Post('/verify')
  // @HttpCode(200)
  // @ApiOperation({
  //   deprecated: true,
  //   summary: 'Проверка смс-кода',
  // })
  // @ApiOkResponse({ type: UserWithTokensDto })
  // @ApiBadRequestResponse({ type: PopUpDto })
  // verifyCode(@I18n() i18n: I18nContext, @Body() dto: VerifyCodeReqDto): Promise<UserWithTokensDto> {
  //   return this.auth.verifyCode(i18n, dto);
  // }

  // @Post('/verify/newPhone')
  // @HttpCode(200)
  // @ApiOperation({
  //   summary: 'Проверка смс-кода для смены номера телефона',
  //   description: 'В поле phone нужно отправлять <b>новый</b> номер телефона',
  // })
  // @ApiOkResponse({ type: UserDto })
  // @ApiBadRequestResponse({ type: PopUpDto })
  // verifyCodeNewPhone(
  //   @I18n() i18n: I18nContext,
  //   @Body() dto: VerifyCodeNewPhoneReqDto,
  // ): Promise<UserDto> {
  //   return this.auth.verifyCodeNewPhone(i18n, dto);
  // }

  @Post('/refreshTokens')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Получение новых токенов',
  })
  @ApiOkResponse({ type: UserWithTokensDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  refreshTokens(
    @I18n() i18n: I18nContext,
    @Body() dto: RefreshTokenReqDto,
  ): Promise<UserWithTokensDto> {
    return this.auth.refreshTokens(i18n, dto);
  }
}
