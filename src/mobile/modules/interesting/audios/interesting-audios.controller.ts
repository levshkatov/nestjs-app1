import { Controller, Get, Param } from '@nestjs/common';
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
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { ParamIdReqDto } from '../../../../shared/dtos/param.dto';
import { UnauthorizedDto, UnsubscribedDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import {
  InterestingAudioDetailedDto,
  InterestingAudioForListDto,
} from './dtos/interesting-audio.dto';
import { InterestingAudiosService } from './interesting-audios.service';

@ApiTags('interesting/audios')
@Controller('')
@SkipAuth()
export class InterestingAudiosController {
  constructor(private audios: InterestingAudiosService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение списка объектов блока "Звуки музыки"',
  })
  @ApiOkResponse({ type: [InterestingAudioForListDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(@I18n() i18n: I18nContext): Promise<InterestingAudioForListDto[]> {
    return this.audios.getAll(i18n);
  }

  @Get('/:id')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение объекта блока "Звуки музыки"',
    description: 'Первый объект из списка можно просмотреть без подписки и авторизации',
  })
  @ApiOkResponse({ type: InterestingAudioDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<InterestingAudioDetailedDto> {
    return this.audios.getOne(i18n, id, user);
  }
}
