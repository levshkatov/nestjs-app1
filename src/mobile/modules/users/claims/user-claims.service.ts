import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { UserClaimReqDto } from './dtos/user-claim.dto';
import { UserClaimOrmService } from '../../../../orm/modules/users/claims/user-claim-orm.service';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { TelegramHelperService } from '../../../../shared/modules/telegram/telegram-helper.service';

@Injectable()
export class UserClaimsService {
  constructor(
    private popup: PopUpService,
    private userClaims: UserClaimOrmService,
    private tg: TelegramHelperService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async post(i18n: I18nContext, { name, email, text }: UserClaimReqDto, { userId }: IJWTUser) {
    this.tg.log(`Claim from user №${userId}`, [name, email, text]);

    const userClaim = await this.userClaims.create({
      userId,
      name,
      email,
      text,
      isResolved: false,
    });

    if (!userClaim) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    throw this.popup.ok(i18n, `claims.added`);
  }
}
