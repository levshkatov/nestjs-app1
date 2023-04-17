import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'node:fs';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Algorithm } from 'jsonwebtoken';
import { VerifyReceiptDto, VerifyReceiptReqDto } from '../dtos/subscription.dto';
import {
  GROUP_ID,
  GROUP_ID_SANDBOX,
  VerifyReceiptSandboxURL,
  VerifyReceiptURL,
} from './app-store-connect.constants';
import {
  AppStoreReceiptRequest,
  AppStoreReceiptResponse,
  LatestReceiptInfo,
} from '../../../../orm/modules/subscriptions/apple/interfaces/app-store-connect';
import { AppStoreNotificationPayload } from '../../../../orm/modules/subscriptions/apple/notifications/interfaces/app-store-connect-notifications';
import { JWS } from 'node-jose';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { join } from 'node:path';
import { MobileConfig } from '../../../../config/interfaces/mobile';
import { AppleSubscriptionNotificationOrmService } from '../../../../orm/modules/subscriptions/apple/notifications/apple-subscription-notification-orm.service';
import { AppleSubscriptionOrmService } from '../../../../orm/modules/subscriptions/apple/apple-subscription-orm.service';
import { AppleSubscriptionType } from '../../../../orm/modules/subscriptions/apple/interfaces/apple-subscription-type.enum';
import { UserOrmService } from '../../../../orm/modules/users/user-orm.service';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { setTimeout } from 'node:timers/promises';

type Notification = { signedPayload: string };

interface WaitForSubscription {
  originalTransactionId: string;
  payload: AppStoreNotificationPayload;
  expiresDate: number;
}

interface ProcessSubscription {
  id: number;
  userId: number;
  payload: AppStoreNotificationPayload;
  expiresDate: number;
}

// get subscription statuses
// https://developer.apple.com/documentation/appstoreserverapi/get_all_subscription_statuses
@Injectable()
export class AppStoreConnect {
  private alg: Algorithm = 'ES256';
  private aud: string = 'appstoreconnect-v1';
  private token: string | null = null;
  private expriresIn: number = 3000; // in s, 50 min
  private expirationDate: number = Math.round(Date.now() / 1000) + this.expriresIn; // in s
  private privateKey = readFileSync(join(process.cwd(), 'secrets', 'apple-subscription-key.p8'));
  private configMobile = this.config.get<MobileConfig>('mobile')!;

  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private http: HttpService,
    private subscriptions: AppleSubscriptionOrmService,
    private notifications: AppleSubscriptionNotificationOrmService,
    private users: UserOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async verifyReceipt(
    userId: number,
    { data: receipt, password }: VerifyReceiptReqDto,
    type: AppleSubscriptionType = AppleSubscriptionType.default,
  ): Promise<[VerifyReceiptDto | null, AppStoreReceiptResponse | null, string[]]> {
    const ret = new VerifyReceiptDto({ trial: true, restore: false });
    const errors: string[] = [];

    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      };

      const body: AppStoreReceiptRequest = {
        'receipt-data': receipt,
        password,
        'exclude-old-transactions': true,
      };

      const [data, reqErrors] = await this.requestApple(body, config);
      if (reqErrors.length) {
        return [null, null, reqErrors];
      }
      if (!data) {
        return [null, null, [`verify receipt: No data returned from apple verification request`]];
      }

      const [isActive, latestTransaction, receiptErrors] = await this.processReceipt(
        type,
        userId,
        data,
        receipt,
        password,
      );
      if (receiptErrors.length) {
        return [ret, data, receiptErrors];
      }

      if (!latestTransaction) {
        return [ret, null, []];
      }

      if (isActive) {
        ret.restore = true;

        // TODO убрать если баг исчезнет
        const user = await this.users.getOne({ where: { id: userId } });
        if (user?.role === UserRole.mobileUnsubscribed) {
          errors.push(`verify receipt: Warning. Subscription is active but user is unsubscribed`);
        }
      }

      if (
        latestTransaction.is_trial_period === 'true' ||
        latestTransaction.is_in_intro_offer_period === 'true'
      ) {
        ret.trial = false;
      }

      return [ret, null, errors];
    } catch (e) {
      return [null, null, [e?.message || `verify receipt: Unknown error`]];
    }
  }

  async verifyReceiptNew(
    userId: number,
    { data: receipt, password }: VerifyReceiptReqDto,
    type: AppleSubscriptionType,
  ): Promise<[AppStoreReceiptResponse | null, string[]]> {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      };

      const body: AppStoreReceiptRequest = {
        'receipt-data': receipt,
        password,
        'exclude-old-transactions': true,
      };

      const [data, reqErrors] = await this.requestApple(body, config);
      if (reqErrors.length) {
        return [null, reqErrors];
      }
      if (!data) {
        return [null, [`verify receipt: No data returned from apple verification request`]];
      }

      const [isActive, latestTransaction, receiptErrors] = await this.processReceipt(
        type,
        userId,
        data,
        receipt,
        password,
      );
      if (receiptErrors.length) {
        return [data, receiptErrors];
      }

      if (!latestTransaction) {
        return [data, [`verify receipt: No latest transaction`]];
      }

      if (!isActive) {
        return [data, [`verify receipt: Subscription expired`]];
      }

      return [data, []];
    } catch (e) {
      return [null, [e?.message || `verify receipt: Unknown error`]];
    }
  }

  private async processReceipt(
    type: AppleSubscriptionType,
    userId: number,
    data: AppStoreReceiptResponse,
    receipt: string,
    password: string,
  ): Promise<[boolean, LatestReceiptInfo | null, string[]]> {
    const { environment, latest_receipt_info, pending_renewal_info } = data;
    if (!environment) {
      return [false, null, [`process receipt: No environment`]];
    }

    if (!['Production', 'Sandbox'].includes(environment)) {
      return [false, null, [`process receipt: Wrong environment`]];
    }

    if (!latest_receipt_info || !latest_receipt_info.length) {
      return [false, null, []];
    }

    const groupId = environment === 'Production' ? GROUP_ID : GROUP_ID_SANDBOX;

    const latestTransaction = latest_receipt_info
      .filter(({ subscription_group_identifier }) => subscription_group_identifier === groupId)
      .sort((a, b) => +b.purchase_date_ms - +a.purchase_date_ms)[0];

    if (!latestTransaction) {
      return [false, null, [`process receipt: No latest transaction`]];
    }

    let {
      product_id,
      expires_date_ms,
      cancellation_date_ms,
      original_transaction_id,
      original_purchase_date_ms,
      purchase_date_ms,
    } = latestTransaction;

    if (pending_renewal_info) {
      const info = pending_renewal_info.find((el) => el.product_id === product_id);
      if (info && info.grace_period_expires_date_ms) {
        expires_date_ms = info.grace_period_expires_date_ms;
      }
    }

    if (cancellation_date_ms) {
      expires_date_ms = cancellation_date_ms;
    }

    const isActive = this.isActive(expires_date_ms);

    if (!original_transaction_id) {
      return [isActive, latestTransaction, ['process receipt: No originalTransactionId']];
    }

    const subscription = await this.subscriptions.getOne({
      where: { originalTransactionId: original_transaction_id },
    });
    if (subscription) {
      await this.subscriptions.update(
        {
          userId,
          environment,
          productId: product_id,
          isActive,
          originalPurchaseDate: this.createDate(original_purchase_date_ms),
          purchaseDate: this.createDate(purchase_date_ms),
          expiresDate: this.createDate(expires_date_ms),
          data,
          renewalInfo: pending_renewal_info,
          receipt,
          password,
        },
        { where: { id: subscription.id } },
      );
    } else {
      await this.subscriptions.create({
        userId,
        originalTransactionId: original_transaction_id,
        environment,
        productId: product_id,
        isActive,
        originalPurchaseDate: this.createDate(original_purchase_date_ms),
        purchaseDate: this.createDate(purchase_date_ms),
        expiresDate: this.createDate(expires_date_ms),
        data,
        renewalInfo: pending_renewal_info,
        receipt,
        password,
      });
    }

    return [isActive, latestTransaction, []];
  }

  async processNotification(
    notification: unknown,
  ): Promise<[AppStoreNotificationPayload | null, string[]]> {
    if (!notification || !this.isNotification(notification)) {
      return [null, ['No signedPayload']];
    }

    let errors: string[] = [];
    let payload: AppStoreNotificationPayload | null = null;

    [payload, errors] = await this.parseNotification(notification.signedPayload);

    if (errors.length) {
      return [payload, errors];
    }

    if (!payload) {
      return [null, ['No payload']];
    }

    const originalTransactionId = payload.data?.transactionInfo?.originalTransactionId;
    const expiresDate = payload.data?.transactionInfo?.expiresDate;
    const { notificationType, subtype, notificationUUID, data } = payload;

    if (!originalTransactionId) {
      errors.push('No originalTransactionId');
    }
    if (!notificationType) {
      errors.push('No notificationType');
    }
    if (!notificationUUID) {
      errors.push('No notificationUUID');
    }
    if (!data) {
      errors.push('No notification data');
    }
    if (!expiresDate) {
      errors.push('No expiresDate');
    }

    if (errors.length) {
      return [payload, errors];
    }

    await this.notifications.create({
      originalTransactionId: originalTransactionId!,
      notificationType,
      subtype,
      notificationUUID,
      renewalInfo: data.renewalInfo,
      transactionInfo: data.transactionInfo!,
    });

    return await this.waitForSubscription({
      originalTransactionId: originalTransactionId!,
      expiresDate: expiresDate!,
      payload,
    });
  }

  private async waitForSubscription(
    { originalTransactionId, expiresDate, payload }: WaitForSubscription,
    attempt: number = 1,
  ): Promise<[AppStoreNotificationPayload, string[]]> {
    if (attempt >= 5) {
      return [payload, [`No subscription - originalTransactionId: ${originalTransactionId}`]];
    }

    const subscription = await this.subscriptions.getOne({ where: { originalTransactionId } });
    if (!subscription) {
      await setTimeout(20000);

      return await this.waitForSubscription(
        { originalTransactionId, expiresDate, payload },
        ++attempt,
      );
    }

    const { id, userId } = subscription;

    return await this.processSubscription({ id, userId, expiresDate, payload });
  }

  private async processSubscription({
    id,
    userId,
    payload,
    expiresDate,
  }: ProcessSubscription): Promise<[AppStoreNotificationPayload, string[]]> {
    const errors: string[] = [];
    const { notificationType, subtype } = payload;

    if (notificationType === 'SUBSCRIBED') {
      if (subtype && subtype === 'RESUBSCRIBE') {
        await this.subscriptions.update(
          { isActive: true, expiresDate: this.createDate(expiresDate) },
          { where: { id } },
        );
        if (userId) {
          await this.users.update({ role: UserRole.mobileSubscribed }, { where: { id: userId } });
        }
      }
    } else if (notificationType === 'DID_RENEW') {
      await this.subscriptions.update(
        { isActive: true, expiresDate: this.createDate(expiresDate) },
        { where: { id } },
      );
      if (userId) {
        await this.users.update({ role: UserRole.mobileSubscribed }, { where: { id: userId } });
      }
    } else if (['EXPIRED', 'REFUND'].includes(notificationType)) {
      await this.subscriptions.update(
        { isActive: false, expiresDate: this.createDate(expiresDate) },
        { where: { id } },
      );
      if (userId) {
        await this.users.update({ role: UserRole.mobileUnsubscribed }, { where: { id: userId } });
      }
    } else if (notificationType === 'DID_FAIL_TO_RENEW' && subtype && subtype === 'GRACE_PERIOD') {
    } else if (notificationType === 'GRACE_PERIOD_EXPIRED') {
    } else if (
      notificationType === 'DID_CHANGE_RENEWAL_STATUS' &&
      subtype &&
      subtype === 'AUTO_RENEW_DISABLED'
    ) {
    } else {
      errors.push(`${userId} - Unknown notificationType`);
      errors.push(notificationType);
      if (subtype) {
        errors.push(subtype);
      }
    }

    return [payload, errors];
  }

  private async parseNotification(
    signed: string,
  ): Promise<[AppStoreNotificationPayload | null, string[]]> {
    const errors: string[] = [];

    try {
      const decoded = await JWS.createVerify().verify(signed, { allowEmbeddedKey: true });
      if (!decoded || !decoded.payload) {
        throw new Error('Notification is not valid');
      }

      const payload = <AppStoreNotificationPayload>JSON.parse(decoded.payload.toString());

      if (payload.data) {
        try {
          if (payload.data.signedRenewalInfo) {
            const decoded = await JWS.createVerify().verify(payload.data.signedRenewalInfo, {
              allowEmbeddedKey: true,
            });
            if (!decoded || !decoded.payload) {
              throw new Error();
            }

            payload.data.renewalInfo = JSON.parse(decoded.payload.toString());
          }
        } catch (e) {
          payload.data.renewalInfo = undefined;
        }

        delete payload.data.signedRenewalInfo;

        try {
          if (payload.data.signedTransactionInfo) {
            const decoded = await JWS.createVerify().verify(payload.data.signedTransactionInfo, {
              allowEmbeddedKey: true,
            });
            if (!decoded || !decoded.payload) {
              throw new Error();
            }

            payload.data.transactionInfo = JSON.parse(decoded.payload.toString());
          }
        } catch (e) {
          payload.data.transactionInfo = undefined;
        }

        delete payload.data.signedTransactionInfo;
      }

      return [payload, errors];
    } catch (e) {
      errors.push(e.message);
    }

    return [null, errors];
  }

  private isActive(expires?: string): boolean {
    return expires && +expires ? +expires > Date.now() : false;
  }

  private createDate(date?: string | number): Date | null {
    return date && +date ? new Date(+date) : null;
  }

  private isNotification(data: unknown): data is Notification {
    return (
      (data as Notification).signedPayload !== undefined &&
      typeof (data as Notification).signedPayload === 'string'
    );
  }

  private async requestApple(
    data: AppStoreReceiptRequest,
    config: AxiosRequestConfig,
    url: string = VerifyReceiptURL,
    attempt: number = 1,
    errors: string[] = [],
  ): Promise<[AppStoreReceiptResponse | null, string[]]> {
    if (attempt > 3) {
      return [null, errors];
    }

    try {
      const res = <AxiosResponse<AppStoreReceiptResponse>>(
        await firstValueFrom(this.http.post(url, data, config))
      );

      if (!res || res.status !== 200 || !res.data) {
        errors.push(
          `${Math.round(Date.now() / 1000)} Attempt: ${attempt}. Unknown error. res.status: ${
            res ? res.status : null
          }`,
        );
        return [null, errors];
      }

      const { status } = res.data;

      if (status === 21007) {
        return await this.requestApple(data, config, VerifyReceiptSandboxURL, attempt, errors);
      }

      if (status !== 0) {
        errors.push(
          `${Math.round(Date.now() / 1000)} Attempt: ${attempt}. Status error. status: ${status}`,
        );

        if (
          [21002, 21005, 21009].includes(status) ||
          (status >= 21100 && res.data['is-retryable'])
        ) {
          return await this.requestApple(data, config, url, ++attempt, errors);
        }

        return [null, errors];
      }

      return [res.data, []];
    } catch (e) {
      errors.push(`${Math.round(Date.now() / 1000)} Attempt: ${attempt}. ${e.message}`);
      return [null, errors];
    }
  }

  private getToken(): string {
    if (this.token && Math.round(Date.now() / 1000) + 60 <= this.expirationDate) {
      return this.token;
    }

    const signOptions: JwtSignOptions = {
      algorithm: this.alg,
      privateKey: this.privateKey,
      header: {
        alg: this.alg,
        kid: this.configMobile.socials.apple.subscription.keyId,
        typ: 'JWT',
      },
    };

    const now = Math.round(Date.now() / 1000);

    const payload = {
      iss: this.configMobile.socials.apple.subscription.issuerId,
      iat: now,
      exp: now + this.expriresIn,
      aud: this.aud,
      bid: this.configMobile.socials.apple.subscription.bundleId,
    };

    this.token = this.jwt.sign(payload, signOptions);
    this.expirationDate = Math.round(Date.now() / 1000) + this.expriresIn;
    return this.token;
  }
}
