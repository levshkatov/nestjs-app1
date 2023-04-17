import { Body, Controller, Delete, Get, HttpStatus, Put, Query, Res } from '@nestjs/common';
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
import { UserDto } from '../../shared/dtos/user.dto';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { UserDeleteDto, UserEditReqDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { HomeScreenDto } from './dtos/home-screen.dto';
import { OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { LevelDto } from '../levels/dtos/level.dto';
import { TreeDto } from '../trees/dtos/tree.dto';
import { UserCelebrityDto } from './dtos/user-celebrity.dto';

@ApiTags('users')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение своего профиля',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  getOne(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserDto> {
    return this.users.getOne(i18n, user);
  }

  @Put('/')
  @ApiOperation({
    summary: 'Редактирование своего профиля',
    // description:
    //   'При изменении телефона, остальные данные не сохранятся. Нужно его сперва верифицировать: /auth/verify/newPhone',
  })
  @ApiCreatedResponse({ type: UserDto, description: 'Профиль изменен' })
  // @ApiOkResponse({ type: OkDto, description: 'Верифицируйте: /auth/verify/newPhone' })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Body() dto: UserEditReqDto,
    @GetUser() user: IJWTUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto | OkDto> {
    const retDto = await this.users.edit(i18n, dto, user);
    if (retDto instanceof OkDto) {
      res.status(HttpStatus.OK);
    } else {
      res.status(HttpStatus.CREATED);
    }
    return retDto;
  }

  @Delete('/')
  @ApiOperation({
    summary: 'Удаление своего профиля',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async delete(
    @I18n() i18n: I18nContext,
    @Query() dto: UserDeleteDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.users.delete(i18n, dto, user);
  }

  @Get('/homeScreen')
  @ApiOperation({ summary: 'Получение типа домашнего экрана' })
  @ApiOkResponse({ type: HomeScreenDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  getHomeScreen(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<HomeScreenDto> {
    return this.users.getHomeScreen(i18n, user);
  }

  @Get('/level')
  @ApiOperation({ summary: 'Получение уровня осознанности' })
  @ApiOkResponse({ type: LevelDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  getLevel(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<LevelDto> {
    return this.users.getLevel(i18n, user);
  }

  @Get('/tree')
  @ApiOperation({
    summary: 'Получение текущего древа пользователя',
  })
  @ApiOkResponse({ type: TreeDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  getTree(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<TreeDto> {
    return this.users.getTree(i18n, user);
  }

  @Get('/celebrity')
  @ApiOperation({ summary: 'Получение текущей знаменитости' })
  @ApiOkResponse({ type: UserCelebrityDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  getCelebrity(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserCelebrityDto> {
    return this.users.getCelebrity(i18n, user);
  }
}
