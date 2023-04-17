import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { InterestingMeditationsMapper } from './interesting-meditations.mapper';
import {
  InterestingMeditationDetailedDto,
  InterestingMeditationGroupByCategoryDto,
} from './dtos/interesting-meditation.dto';
import { InterestingMeditationOrmService } from '../../../../orm/modules/interesting/meditations/interesting-meditation-orm.service';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { checkSubscription } from '../../../../shared/helpers/check-subscription.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class InterestingMeditationsService {
  constructor(
    private popup: PopUpService,
    private meditations: InterestingMeditationOrmService,
    private meditationsMapper: InterestingMeditationsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<InterestingMeditationGroupByCategoryDto[]> {
    return this.meditationsMapper.toInterestingMeditationListDto(
      i18n,
      await this.meditations.getAll(
        {
          where: { disabled: false },
          order: [
            ['categoryId', 'ASC'],
            ['id', 'ASC'],
          ],
        },
        ['i18n', 'photo', 'category'],
      ),
    );
  }

  async getOne(
    i18n: I18nContext,
    id: number,
    user?: IJWTUser,
  ): Promise<InterestingMeditationDetailedDto> {
    const meditation = await this.meditations.getOneFromAll({ where: { id, disabled: false } }, [
      'i18n',
      'audioMale',
      'audioFemale',
    ]);
    if (!meditation) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    const firstMeditation = await this.meditations.getOneFromAll(
      { where: { categoryId: meditation.categoryId, disabled: false }, order: [['id', 'ASC']] },
      ['i18n', 'audioMale', 'audioFemale'],
    );
    if (!firstMeditation) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    if (firstMeditation.id === id) {
      return this.meditationsMapper.toInterestingMeditationDetailedDto(i18n, firstMeditation);
    }

    checkSubscription(user);

    return this.meditationsMapper.toInterestingMeditationDetailedDto(i18n, meditation);
  }
}
