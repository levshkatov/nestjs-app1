import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { VerifyReceiptDto, VerifyReceiptReqDto } from './dtos/subscription.dto';
import { SubscriptionsService } from './subscriptions.service';
import { Response } from 'express';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { SubscriptionType } from './interfaces/subscription-type.enum';

@ApiTags('subscriptions')
@Controller('')
@SkipAuth()
export class SubscriptionsController {
  constructor(private subscriptions: SubscriptionsService) {}

  @Post('/verifyReceipt')
  @SkipAuth(false)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Верификация чека',
  })
  @ApiOkResponse({ type: VerifyReceiptDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async verifyReceipt(
    @I18n() i18n: I18nContext,
    @Body() dto: VerifyReceiptReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<VerifyReceiptDto> {
    return this.subscriptions.verifyReceipt(i18n, dto, user);
  }

  @Post('/verifyReceipt/new')
  @SkipAuth(false)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Верификация чека при оформлении новой подписки',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async verifyReceiptNew(
    @I18n() i18n: I18nContext,
    @Body() dto: VerifyReceiptReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.subscriptions.verifyReceiptNew(i18n, dto, user);
  }

  @Post('/verifyReceipt/restore')
  @SkipAuth(false)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Верификация чека при восстановлении подписки',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async verifyReceiptRestore(
    @I18n() i18n: I18nContext,
    @Body() dto: VerifyReceiptReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.subscriptions.verifyReceiptNew(i18n, dto, user, true);
  }

  @Post('/apple/v2')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Для приема уведомлений apple subscriptions',
  })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async appleNotify(@Body() data: unknown) {
    this.subscriptions.processNotification(data, SubscriptionType.apple);
    return;
  }
}
