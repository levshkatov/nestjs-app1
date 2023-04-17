import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../../pop-up/pop-up.service';
import { InterestingChecklistsMapper } from './interesting-checklists.mapper';
import {
  InterestingChecklistDetailedDto,
  InterestingChecklistGroupByCategoryDto,
  UserInterestingChecklistDataReqDto,
} from './dtos/interesting-checklist.dto';
import * as moment from 'moment';
import { Op } from 'sequelize';
import { InterestingChecklistOrmService } from '../../../../orm/modules/interesting/checklists/interesting-checklist-orm.service';
import {
  IInterestingChecklist,
  InterestingChecklistScopesMap,
} from '../../../../orm/modules/interesting/checklists/interfaces/interesting-checklist.interface';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { checkSubscription } from '../../../../shared/helpers/check-subscription.helper';
import { BS } from '../../../../orm/shared/interfaces/scopes.interface';
import { UserInterestingChecklistDataOrmService } from '../../../../orm/modules/users/interesting-checklist-datas/user-interesting-checklist-data-orm.service';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';

@Injectable()
export class InterestingChecklistsService {
  constructor(
    private popup: PopUpService,
    private checklists: InterestingChecklistOrmService,
    private checklistsMapper: InterestingChecklistsMapper,
    private userChecklists: UserInterestingChecklistDataOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(i18n: I18nContext): Promise<InterestingChecklistGroupByCategoryDto[]> {
    return this.checklistsMapper.toInterestingChecklistListDto(
      i18n,
      await this.checklists.getAll(
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
  ): Promise<InterestingChecklistDetailedDto> {
    const checklist = await this.checklists.getOneFromAll({ where: { id, disabled: false } }, [
      'task',
    ]);
    if (!checklist) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    const firstChecklist = await this.checklists.getOneFromAll(
      { where: { categoryId: checklist.categoryId, disabled: false }, order: [['id', 'ASC']] },
      ['task'],
    );
    if (!firstChecklist) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    if (firstChecklist.id === id) {
      return await this.getSavedData(i18n, id, firstChecklist, user);
    }

    checkSubscription(user);

    return await this.getSavedData(i18n, id, checklist, user);
  }

  async getSavedData(
    i18n: I18nContext,
    interestingChecklistId: number,
    checklist: BS<IInterestingChecklist, InterestingChecklistScopesMap, 'task'>,
    user?: IJWTUser,
  ): Promise<InterestingChecklistDetailedDto> {
    try {
      checkSubscription(user);
    } catch {
      return this.checklistsMapper.toInterestingChecklistDetailedDto(i18n, checklist);
    }

    const { offsetUTC: userOffset, userId } = user!; // because we checked user in checkSubscription

    const offsetUTC = userOffset.split(':').map((el) => +el);
    const todayMidnight = moment
      .utc()
      .add({ hours: offsetUTC[0], minutes: offsetUTC[1] })
      .set({ hours: 0, minutes: 0, seconds: 0 })
      .toDate();
    const tomorrowMidnight = moment
      .utc()
      .add({ days: 1, hours: offsetUTC[0], minutes: offsetUTC[1] })
      .set({ hours: 0, minutes: 0, seconds: 0 })
      .toDate();

    const createdAt = {
      [Op.and]: {
        [Op.gte]: todayMidnight,
        [Op.lt]: tomorrowMidnight,
      },
    };

    const userChecklistData = await this.userChecklists.getOne({
      where: {
        userId,
        interestingChecklistId,
        createdAt,
      },
    });

    return this.checklistsMapper.toInterestingChecklistDetailedDto(
      i18n,
      checklist,
      userChecklistData?.content,
    );
  }

  async saveData(
    i18n: I18nContext,
    id: number,
    { content }: UserInterestingChecklistDataReqDto,
    { userId }: IJWTUser,
  ): Promise<OkDto> {
    const checklist = await this.checklists.getOneFromAll({ where: { id, disabled: false } }, [
      'task',
    ]);
    if (!checklist) {
      throw this.popup.error(i18n, `interesting.notFound`);
    }

    // TODO validate content

    await this.userChecklists.upsert({
      userId,
      interestingChecklistId: id,
      content,
    });

    return new OkDto();
  }
}
