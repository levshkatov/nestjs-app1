import { Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { ParamIdReqDto } from '../../../../shared/dtos/param.dto';
import { OkDto, UnauthorizedDto, UnsubscribedDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import { UserLetterDto } from './dtos/user-letter.dto';
import { UserLettersService } from './user-letters.service';

@ApiTags('users/letters')
@Controller('letters')
@SkipAuth(false)
@ApiBearerAuth()
@Roles(UserRole.mobileSubscribed)
export class UserLettersController {
  constructor(private userLetters: UserLettersService) {}

  @Get('/')
  @ApiOperation({
    summary: '[subscribed] Получение писем',
  })
  @ApiOkResponse({ type: [UserLetterDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getLetter(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserLetterDto[]> {
    return this.userLetters.get(i18n, user);
  }

  @Put('/:id/action/read')
  @ApiOperation({
    summary: '[subscribed] Отметить письмо как прочитанное',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  readLetter(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.userLetters.read(i18n, id, user);
  }
}
