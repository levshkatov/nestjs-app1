import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppleSignIn } from 'apple-sign-in-rest';
import { I18nContext } from 'nestjs-i18n';
import { join } from 'node:path';
import { MobileConfig } from '../../../../../config/interfaces/mobile';
import { logClassName } from '../../../../../shared/helpers/log-classname.helper';
import { PopUpService } from '../../../pop-up/pop-up.service';
import { IAppleUserInfo } from './interfaces/apple.interface';

@Injectable()
export class AppleService {
  private apple: AppleSignIn;

  constructor(private config: ConfigService, private popup: PopUpService) {
    logClassName(this.constructor.name, __filename);
    const options = this.config.get<MobileConfig>('mobile')!.socials.apple;
    this.apple = new AppleSignIn({
      clientId: options.clientId,
      teamId: options.teamId,
      keyIdentifier: options.keyIdentifier,
      privateKeyPath: join(process.cwd(), 'secrets', 'apple-auth-key.p8'),
    });
  }

  async getToken(i18n: I18nContext, authCode: string): Promise<IAppleUserInfo> {
    try {
      const response = await this.apple.getAuthorizationToken(
        this.apple.createClientSecret({}),
        authCode,
        {},
      );

      if (!response.id_token) {
        throw new Error('No response.id_token');
      }

      const token = await this.apple.verifyIdToken(response.id_token, {});
      if (!token || !token.sub) {
        throw new Error('No token or token.sub');
      }

      return { sub: token.sub, email: token.email };
    } catch (e) {
      const error = this.popup.error(i18n, `signIn.commonError`);
      if (e && typeof e === 'string') {
        error.errors!.push(e);
      }
      if (e.message && typeof e.message === 'string') {
        error.errors!.push(e.message);
      }
      throw error;
    }
  }
}
