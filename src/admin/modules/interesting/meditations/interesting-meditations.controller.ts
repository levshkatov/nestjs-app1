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
  InterestingMeditationsForListDto,
  InterestingMeditationCreateReqDto,
  InterestingMeditationDetailedDto,
  InterestingMeditationEditReqDto,
  InterestingMeditationsReqDto,
} from './dtos/interesting-meditation.dto';
import { InterestingMeditationsService } from './interesting-meditations.service';

@ApiTags('interesting/meditations')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class InterestingMeditationsController {
  constructor(private interestingMeditations: InterestingMeditationsService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех объектов блока "Медитации"',
  })
  @ApiOkResponse({ type: InterestingMeditationsForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
  ): Promise<InterestingMeditationsForListDto> {
    return this.interestingMeditations.getAll(i18n, paginate(page));
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление объекта блока "Медитации"',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Body() dto: InterestingMeditationCreateReqDto,
  ): Promise<OkDto> {
    return this.interestingMeditations.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение объекта блока "Медитации" по id',
  })
  @ApiOkResponse({ type: InterestingMeditationDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<InterestingMeditationDetailedDto> {
    return this.interestingMeditations.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение объекта блока "Медитации" по id',
    description: 'webEditor может изменить все поля, кроме *disabled*',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: InterestingMeditationEditReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.interestingMeditations.edit(i18n, id, dto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление объекта блока "Медитации" по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.interestingMeditations.delete(i18n, id);
  }
}
