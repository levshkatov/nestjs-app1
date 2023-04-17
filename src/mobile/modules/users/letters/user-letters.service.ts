import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { UserLetterOrmService } from '../../../../orm/modules/users/letters/user-letter-orm.service';
import { UserOrmService } from '../../../../orm/modules/users/user-orm.service';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpService } from '../../pop-up/pop-up.service';
import { UserLetterDto } from './dtos/user-letter.dto';
import { UserLettersMapper } from './user-letters.mapper';

@Injectable()
export class UserLettersService {
  constructor(
    private popup: PopUpService,
    private users: UserOrmService,
    private userLetters: UserLetterOrmService,
    private userLettersMapper: UserLettersMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async get(i18n: I18nContext, { userId }: IJWTUser): Promise<UserLetterDto[]> {
    const user = await this.users.getOneFromAll({ where: { id: userId } }, ['letters']);
    if (!user) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    return user.letters.map((letter) => this.userLettersMapper.toUserLetterDto(i18n, letter));
  }

  async read(i18n: I18nContext, letterId: number, { userId }: IJWTUser): Promise<OkDto> {
    await this.userLetters.destroy({ where: { letterId, userId } });
    return new OkDto();
  }
}
