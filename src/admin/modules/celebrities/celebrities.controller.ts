import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { ErrorDto, ForbiddenDto, OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { paginate } from '../../../shared/helpers/paginate.helper';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { CelebritiesService } from './celebrities.service';
import {
  CelebritiesForListDto,
  CelebritiesReqDto,
  CelebrityCreateReqDto,
  CelebrityDetailedDto,
  CelebrityEditReqDto,
} from './dtos/celebrity.dto';

@ApiTags('celebrities')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class CelebritiesController {
  constructor(private celebrities: CelebritiesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех знаменитостей',
  })
  @ApiOkResponse({ type: CelebritiesForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
    @Query() dto: CelebritiesReqDto,
  ): Promise<CelebritiesForListDto> {
    return this.celebrities.getAll(i18n, paginate(page), dto);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление знаменитости',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(@I18n() i18n: I18nContext, @Body() dto: CelebrityCreateReqDto): Promise<OkDto> {
    return this.celebrities.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение знаменитости по id',
  })
  @ApiOkResponse({ type: CelebrityDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<CelebrityDetailedDto> {
    return this.celebrities.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение знаменитости по id',
    description: 'webEditor может изменить все поля, кроме *disabled*',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: CelebrityEditReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.celebrities.edit(i18n, id, dto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление знаменитости по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.celebrities.delete(i18n, id);
  }
}
