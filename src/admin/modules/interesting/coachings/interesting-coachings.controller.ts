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
  InterestingCoachingsForListDto,
  InterestingCoachingCreateReqDto,
  InterestingCoachingDetailedDto,
  InterestingCoachingEditReqDto,
  InterestingCoachingsReqDto,
} from './dtos/interesting-coaching.dto';
import { InterestingCoachingsService } from './interesting-coachings.service';

@ApiTags('interesting/coachings')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class InterestingCoachingsController {
  constructor(private interestingCoachings: InterestingCoachingsService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех объектов блока "Коучинг"',
  })
  @ApiOkResponse({ type: InterestingCoachingsForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
  ): Promise<InterestingCoachingsForListDto> {
    return this.interestingCoachings.getAll(i18n, paginate(page));
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление объекта блока "Коучинг"',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Body() dto: InterestingCoachingCreateReqDto,
  ): Promise<OkDto> {
    return this.interestingCoachings.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение объекта блока "Коучинг" по id',
  })
  @ApiOkResponse({ type: InterestingCoachingDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<InterestingCoachingDetailedDto> {
    return this.interestingCoachings.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение объекта блока "Коучинг" по id',
    description: 'webEditor может изменить все поля, кроме *disabled*',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: InterestingCoachingEditReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.interestingCoachings.edit(i18n, id, dto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление объекта блока "Коучинг" по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.interestingCoachings.delete(i18n, id);
  }
}
