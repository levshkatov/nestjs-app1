import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { InterestingCoachingsMapper } from './interesting-coachings.mapper';
import {
  InterestingCoachingDetailedDto,
  InterestingCoachingForListDto,
  InterestingCoachingGroupByCategoryDto,
} from './dtos/interesting-coaching.dto';
import { InterestingCoachingOrmService } from '../../../../orm/modules/interesting/coachings/interesting-coaching-orm.service';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { checkSubscription } from '../../../../shared/helpers/check-subscription.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { interestingCoachingOrders } from '../../../../orm/modules/interesting/coachings/scopes/interesting-coaching.scopes';

@Injectable()
export class InterestingCoachingsService {
  constructor(
    private popup: PopUpService,
    private coachings: InterestingCoachingOrmService,
    private coachingsMapper: InterestingCoachingsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<InterestingCoachingForListDto[]> {
    return (
      await this.coachings.getAll(
        {
          where: { disabled: false },
          order: [['id', 'ASC']],
        },
        ['exercise', 'photo'],
      )
    ).map((coaching) => this.coachingsMapper.toInterestingCoachingForListDto(i18n, coaching));
  }

  async getOne(
    i18n: I18nContext,
    id: number,
    user?: IJWTUser,
  ): Promise<InterestingCoachingDetailedDto> {
    const coaching = await this.coachings.getOneFromAll(
      {
        where: { id, disabled: false },
        order: [interestingCoachingOrders.coachingExerciseTasks],
      },
      ['exercise'],
    );
    if (!coaching) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    const firstCoaching = await this.coachings.getOneFromAll(
      {
        where: { disabled: false },
        order: [['id', 'ASC'], interestingCoachingOrders.coachingExerciseTasks],
      },
      ['exercise'],
    );
    if (!firstCoaching) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    if (firstCoaching.id === id) {
      return this.coachingsMapper.toInterestingCoachingDetailedDto(i18n, firstCoaching);
    }

    checkSubscription(user);

    return this.coachingsMapper.toInterestingCoachingDetailedDto(i18n, coaching);
  }

  // LEGACY
  async getAllOld(i18n: I18nContext): Promise<InterestingCoachingGroupByCategoryDto[]> {
    return this.coachingsMapper.toInterestingCoachingListDto(
      i18n,
      await this.coachings.getAll(
        {
          where: { disabled: false },
          order: [
            ['categoryId', 'ASC'],
            ['id', 'ASC'],
          ],
        },
        ['category', 'exercise', 'photo'],
      ),
    );
  }

  // LEGACY
  async getOneOld(
    i18n: I18nContext,
    id: number,
    user?: IJWTUser,
  ): Promise<InterestingCoachingDetailedDto> {
    const coaching = await this.coachings.getOneFromAll(
      {
        where: { id, disabled: false },
        order: [interestingCoachingOrders.coachingExerciseTasks],
      },
      ['exercise'],
    );
    if (!coaching) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    const firstCoaching = await this.coachings.getOneFromAll(
      {
        where: { categoryId: coaching.categoryId, disabled: false },
        order: [['id', 'ASC'], interestingCoachingOrders.coachingExerciseTasks],
      },
      ['exercise'],
    );
    if (!firstCoaching) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    if (firstCoaching.id === id) {
      return this.coachingsMapper.toInterestingCoachingDetailedDto(i18n, firstCoaching);
    }

    checkSubscription(user);

    return this.coachingsMapper.toInterestingCoachingDetailedDto(i18n, coaching);
  }
}
