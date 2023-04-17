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
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../../shared/dtos/param.dto';
import {
  ErrorDto,
  ForbiddenDto,
  OkDto,
  UnauthorizedDto,
} from '../../../../shared/dtos/responses.dto';
import { paginate } from '../../../../shared/helpers/paginate.helper';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import {
  InterestingHelpsForListDto,
  InterestingHelpCreateReqDto,
  InterestingHelpDetailedDto,
  InterestingHelpEditReqDto,
  InterestingHelpsReqDto,
} from './dtos/interesting-help.dto';
import { InterestingHelpsService } from './interesting-helps.service';

@ApiTags('interesting/helps')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class InterestingHelpsController {
  constructor(private interestingHelps: InterestingHelpsService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех объектов блока "Скорая эмоциональная помощь"',
  })
  @ApiOkResponse({ type: InterestingHelpsForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
  ): Promise<InterestingHelpsForListDto> {
    return this.interestingHelps.getAll(i18n, paginate(page));
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление объекта блока "Скорая эмоциональная помощь"',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Body() dto: InterestingHelpCreateReqDto,
  ): Promise<OkDto> {
    return this.interestingHelps.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение объекта блока "Скорая эмоциональная помощь" по id',
  })
  @ApiOkResponse({ type: InterestingHelpDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<InterestingHelpDetailedDto> {
    return this.interestingHelps.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение объекта блока "Скорая эмоциональная помощь" по id',
    description: 'webEditor может изменить все поля, кроме *disabled*',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: InterestingHelpEditReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.interestingHelps.edit(i18n, id, dto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление объекта блока "Скорая эмоциональная помощь" по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.interestingHelps.delete(i18n, id);
  }
}
