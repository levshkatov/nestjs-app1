import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { UserProfileOrmService } from '../../../../orm/modules/users/profiles/user-profile-orm.service';
import { UserOrmService } from '../../../../orm/modules/users/user-orm.service';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpService } from '../../pop-up/pop-up.service';
import { UserWaterBalanceDto } from './dtos/user-water-balance.dto';
import { MAX_WATER_BALANCE } from './interfaces/user-water-balance.constants';

@Injectable()
export class UserWaterBalanceService {
  constructor(
    private popup: PopUpService,
    private userProfiles: UserProfileOrmService,
    private users: UserOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async get(i18n: I18nContext, { userId }: IJWTUser): Promise<UserWaterBalanceDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', ['profile']);
    if (!user) {
      throw this.popup.error(i18n, `users.notFound`);
    }

    const {
      profile: { waterBalance },
    } = user;

    return new UserWaterBalanceDto({ waterBalance });
  }

  async increase(i18n: I18nContext, { userId }: IJWTUser): Promise<UserWaterBalanceDto> {
    const user = await this.users.getOneType({ where: { id: userId } }, 'mobile', ['profile']);
    if (!user) {
      throw this.popup.error(i18n, `users.notFound`);
    }

    const {
      profile: { waterBalance },
    } = user;

    if (waterBalance >= MAX_WATER_BALANCE) {
      throw this.popup.error(i18n, `waterBalance.max`);
    }

    await this.userProfiles.update({ waterBalance: waterBalance + 1 }, { where: { userId } });

    return new UserWaterBalanceDto({ waterBalance });
  }
}
