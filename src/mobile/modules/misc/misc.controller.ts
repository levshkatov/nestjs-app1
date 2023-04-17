import { Body, Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { NotificationType } from '../../../orm/modules/notifications/interfaces/notification-type.enum';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { IsEnum } from '../../../shared/class-validator';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { OkDto, UnauthorizedDto, UnsubscribedDto } from '../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { MiscService } from './misc.service';

class TestPushDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type!: NotificationType;
}

@ApiTags('misc')
@Controller('')
@SkipAuth()
export class MiscController {
  constructor(private misc: MiscService) {}

  @Get('/ping')
  @ApiOperation({ summary: 'Пинг сервера' })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  ping(): OkDto {
    return this.misc.ping();
  }

  @Get('/pingAuth')
  @SkipAuth(false)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Пинг сервера, авторизованный запрос' })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  pingAuth(): OkDto {
    return this.misc.ping();
  }

  @Get('/pingSubscription')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Пинг сервера, роль: subscribed',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  pingSubscription(): OkDto {
    return this.misc.ping();
  }

  // @Get('/test')
  // @ApiOperation({
  //   deprecated: true,
  //   summary: 'Тестовый метод',
  // })
  // @ApiOkResponse({ type: OkDto })
  // @ApiBadRequestResponse({ type: PopUpDto })
  // test(@I18n() i18n: I18nContext): Promise<OkDto> {
  //   return this.misc.test(i18n);
  // }

  // @Get('/testPush')
  // @SkipAuth()
  // @ApiSecurity('')
  // @ApiBearerAuth()
  // @ApiOperation({
  //   deprecated: true,
  //   summary: 'Тестовый метод для пушей',
  // })
  // testPush(@I18n() i18n: I18nContext, @Query() { type }: TestPushDto, @GetUser() user?: IJWTUser) {
  //   return this.misc.testPush(i18n, type, user);
  // }
}
