import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { UnauthorizedDto, UnsubscribedDto } from '../../../shared/dtos/responses.dto';
import { TagReqDto } from '../../../shared/dtos/tag.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { CelebritiesService } from './celebrities.service';
import {
  CelebrityDetailedDto,
  CelebrityForListDto,
  CelebrityRemoveDto,
  CelebrityStartDto,
} from './dtos/celebrity.dto';

@ApiTags('celebrities')
@Controller('')
@SkipAuth()
export class CelebritiesController {
  constructor(private celebrities: CelebritiesService) {}

  @Get('/')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение всех знаменитостей',
    description: 'Если запрос авторизован, то в ответ будет добавлено поле <i>isAdded</i>',
  })
  @ApiOkResponse({ type: [CelebrityForListDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(@I18n() i18n: I18nContext, @GetUser() user?: IJWTUser): Promise<CelebrityForListDto[]> {
    return this.celebrities.getAll(i18n, user);
  }

  @Get('/tag')
  @ApiOperation({
    summary: 'Получение знаменитости по тегу',
  })
  @ApiOkResponse({ type: CelebrityDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOneByTag(
    @I18n() i18n: I18nContext,
    @Query() { tag }: TagReqDto,
  ): Promise<CelebrityDetailedDto> {
    return this.celebrities.getOne(i18n, { tag });
  }

  @Get('/:id')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение знаменитости по id',
    description: 'Если запрос авторизован, то в ответ будет добавлено поле <i>isAdded</i>',
  })
  @ApiOkResponse({ type: CelebrityDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOneById(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<CelebrityDetailedDto> {
    return this.celebrities.getOne(i18n, { id }, user);
  }

  @Put('/:id/action/start')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Начать следовать привычкам знаменитости',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  start(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Query() dto: CelebrityStartDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.celebrities.start(i18n, id, dto, user);
  }

  @Put('/:id/action/remove')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Прекратить следовать привычкам знаменитости',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  remove(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Query() dto: CelebrityRemoveDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.celebrities.remove(i18n, id, dto, user);
  }
}
