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
import { InterestingHelpDetailedDto, InterestingHelpForListDto } from './dtos/interesting-help.dto';
import { InterestingHelpsService } from './interesting-helps.service';

@ApiTags('interesting/helps')
@Controller('')
@SkipAuth()
export class InterestingHelpsController {
  constructor(private helps: InterestingHelpsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение списка объектов блока "Скорая эмоциональная помощь"',
  })
  @ApiOkResponse({ type: [InterestingHelpForListDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(@I18n() i18n: I18nContext): Promise<InterestingHelpForListDto[]> {
    return this.helps.getAll(i18n);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Получение объекта блока "Скорая эмоциональная помощь"',
  })
  @ApiOkResponse({ type: InterestingHelpDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<InterestingHelpDetailedDto> {
    return this.helps.getOne(i18n, id);
  }
}
