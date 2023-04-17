import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { InterestingAudiosMapper } from './interesting-audios.mapper';
import {
  InterestingAudioDetailedDto,
  InterestingAudioForListDto,
} from './dtos/interesting-audio.dto';
import { InterestingAudioOrmService } from '../../../../orm/modules/interesting/audios/interesting-audio-orm.service';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { checkSubscription } from '../../../../shared/helpers/check-subscription.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class InterestingAudiosService {
  constructor(
    private popup: PopUpService,
    private audios: InterestingAudioOrmService,
    private audiosMapper: InterestingAudiosMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<InterestingAudioForListDto[]> {
    return (
      await this.audios.getAll({ where: { disabled: false }, order: [['id', 'ASC']] }, ['i18n'])
    ).map((audio) => this.audiosMapper.toInterestingAudioForListDto(i18n, audio));
  }

  async getOne(
    i18n: I18nContext,
    id: number,
    user?: IJWTUser,
  ): Promise<InterestingAudioDetailedDto> {
    const audio = await this.audios.getOne({ where: { id, disabled: false } }, ['audio']);
    if (!audio) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    const firstAudio = await this.audios.getOne(
      { where: { disabled: false }, order: [['id', 'ASC']] },
      ['audio'],
    );
    if (!firstAudio) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    if (firstAudio.id === id) {
      return this.audiosMapper.toInterestingAudioDetailedDto(i18n, firstAudio);
    }

    checkSubscription(user);

    return this.audiosMapper.toInterestingAudioDetailedDto(i18n, audio);
  }
}
