import { Body, Controller, Get, HttpStatus, Post, Put, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AdminConfig } from '../../../config/interfaces/admin';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../shared/dtos/page.dto';
import { ErrorDto, ForbiddenDto, OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { paginate } from '../../../shared/helpers/paginate.helper';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { clearToken } from '../../shared/helpers/cookies.helper';
import {
  UserDetailedDto,
  UsersForListDto,
  UserProfileReqDto,
  UsersReqDto,
  UserCreateReqDto,
  UserEditReqDto,
} from './dtos/user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class UsersController {
  constructor(private users: UsersService, private config: ConfigService) {}

  private configAdmin = this.config.get<AdminConfig>('admin')!;

  // TODO maybe ban user

  @Get('/')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Получение всех пользователей',
  })
  @ApiOkResponse({ type: UsersForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
    @Query() dto: UsersReqDto,
  ): Promise<UsersForListDto> {
    return this.users.getAll(i18n, paginate(page), dto);
  }

  @Post('/')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Создание пользователя',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(@I18n() i18n: I18nContext, @Body() dto: UserCreateReqDto): Promise<OkDto> {
    return this.users.create(i18n, dto);
  }

  @Put('/')
  @ApiOperation({
    summary: '[all] Редактирование своего профиля',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiResponse({
    status: 205,
    description:
      'Приходит при изменении пароля. При этом очищаются авторизационные токены, поэтому необходимо выбросить на страницу авторизации',
  })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Body() dto: UserEditReqDto,
    @GetUser() user: IJWTUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OkDto> {
    const { response, clearCookie } = await this.users.edit(i18n, dto, user);
    if (clearCookie) {
      clearToken('accessToken', res, this.configAdmin);
      clearToken('refreshToken', res, this.configAdmin);
      res.status(HttpStatus.RESET_CONTENT);
    }
    return response;
  }

  @Get('/profile')
  @ApiOperation({
    summary: '[all / webAdmin] Получение профиля пользователя',
    description: `Если id не указан - вернется свой профиль.<br> Если указан, то необходимы права <b>[webAdmin]</b>`,
  })
  @ApiOkResponse({ type: UserDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Query() dto: UserProfileReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<UserDetailedDto> {
    return this.users.getOne(i18n, dto, user);
  }
}
