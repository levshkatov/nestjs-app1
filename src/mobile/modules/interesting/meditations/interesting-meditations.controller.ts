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
  InterestingMeditationDetailedDto,
  InterestingMeditationGroupByCategoryDto,
} from './dtos/interesting-meditation.dto';
import { InterestingMeditationsService } from './interesting-meditations.service';

@ApiTags('interesting/meditations')
@Controller('')
@SkipAuth()
export class InterestingMeditationsController {
  constructor(private meditations: InterestingMeditationsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение списка объектов блока "Медитации"',
  })
  @ApiOkResponse({ type: [InterestingMeditationGroupByCategoryDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(@I18n() i18n: I18nContext): Promise<InterestingMeditationGroupByCategoryDto[]> {
    return this.meditations.getAll(i18n);
  }

  @Get('/:id')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение объекта блока "Медитации"',
    description: 'Первый объект из списка можно просмотреть без подписки и авторизации',
  })
  @ApiOkResponse({ type: InterestingMeditationDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<InterestingMeditationDetailedDto> {
    return this.meditations.getOne(i18n, id, user);
  }
}
