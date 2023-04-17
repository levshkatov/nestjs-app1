import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../pop-up/pop-up.service';
import { SubscriptionsMapper } from './subscriptions.mapper';
import { VerifyReceiptDto, VerifyReceiptReqDto } from './dtos/subscription.dto';
import { AppStoreConnect } from './apple/app-store-connect.service';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';
import { TelegramHelperService } from '../../../shared/modules/telegram/telegram-helper.service';
import { OkDto } from '../../../shared/dtos/responses.dto';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { SubscriptionType } from './interfaces/subscription-type.enum';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { AppleSubscriptionType } from '../../../orm/modules/subscriptions/apple/interfaces/apple-subscription-type.enum';

@Injectable()
export class SubscriptionsService {
  private env = process.env['NODE_ENV'];

  constructor(
    private popup: PopUpService,
    private i18n: I18nHelperService,
    private subscriptionsMapper: SubscriptionsMapper,
    private appStoreConnect: AppStoreConnect,
    private tg: TelegramHelperService,
    private users: UserOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async verifyReceipt(
    i18n: I18nContext,
    dto: VerifyReceiptReqDto,
    { userId, name, role }: IJWTUser,
  ): Promise<VerifyReceiptDto> {
    const { type = SubscriptionType.apple } = dto;

    let ret: VerifyReceiptDto | null = null;
    let errors: string[] = [];
    let data: object | null = null;

    if (type === SubscriptionType.apple) {
      [ret, data, errors] = await this.appStoreConnect.verifyReceipt(userId, dto);
    }

    if (ret) {
      if (errors.length) {
        // TODO remove when we fix bug
        // if (errors[0]?.includes('Subscription is active')) {
        //   await this.users.update({ role: UserRole.mobileSubscribed }, { where: { id: userId } });
        // }

        this.tg.log(`${this.env} - verifyReceipt`, [`${userId} - ${name} - ${role}`, ...errors]);
        if (data) {
          this.tg.sendData(data, 'receipt.json');
        }
      }

      return ret;
    }

    this.tg.log(`${this.env} - verifyReceipt`, [
      `${userId} - ${name} - ${role}`,
      'No return value',
      ...errors,
    ]);
    if (data) {
      this.tg.sendData(data, 'receipt.json');
    }

    throw this.popup.error(
      i18n,
      `subscriptions.commonError`,
      errors.length ? errors : ['No return value'],
    );
  }

  async verifyReceiptNew(
    i18n: I18nContext,
    dto: VerifyReceiptReqDto,
    { userId, name, role }: IJWTUser,
    isRestore: boolean = false,
  ): Promise<OkDto> {
    const { type = SubscriptionType.apple } = dto;

    let errors: string[] = [];
    let data: object | null = null;

    if (type === SubscriptionType.apple) {
      [data, errors] = await this.appStoreConnect.verifyReceiptNew(
        userId,
        dto,
        isRestore ? AppleSubscriptionType.restore : AppleSubscriptionType.new,
      );
    }

    if (errors.length) {
      this.tg.log(`${this.env} - verifyReceiptNew`, [`${userId} - ${name} - ${role}`, ...errors]);
      if (data) {
        this.tg.sendData(data, 'receipt.json');
      }

      throw this.popup.error(i18n, `subscriptions.commonError`, errors);
    }

    await this.users.update({ role: UserRole.mobileSubscribed }, { where: { id: userId } });

    return new OkDto();
  }

  // for cron
  async verifyReceiptUpdate(dto: VerifyReceiptReqDto, userId: number): Promise<void> {
    const { type } = dto;

    let errors: string[] = [];
    let data: object | null = null;

    if (type === SubscriptionType.apple) {
      [data, errors] = await this.appStoreConnect.verifyReceiptNew(
        userId,
        dto,
        AppleSubscriptionType.new,
      );
    }

    if (errors.length) {
      await this.users.update({ role: UserRole.mobileUnsubscribed }, { where: { id: userId } });

      if (errors[0]?.includes('Subscription expired')) {
        return;
      }

      this.tg.log(`${this.env} - verifyReceiptUpdate`, [`${userId}`, ...errors]);
      if (data) {
        this.tg.sendData(data, 'receipt.json');
      }

      return;
    }

    await this.users.update({ role: UserRole.mobileSubscribed }, { where: { id: userId } });

    return;
  }

  async processNotification(data: unknown, type: SubscriptionType) {
    let errors: string[] = [];
    let payload: object | null = null;
    try {
      if (type === SubscriptionType.apple) {
        [payload, errors] = await this.appStoreConnect.processNotification(data);
        if (errors.length) {
          throw new Error();
        }
      }
    } catch (e) {
      this.tg.log(
        `${this.env} - processNotification`,
        e?.message ? [e.message, ...errors] : errors,
      );
      if (payload) {
        this.tg.sendData(payload, 'notification.json');
      }
    }
  }
}
