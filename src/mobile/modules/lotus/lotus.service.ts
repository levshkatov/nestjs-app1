import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PopUpService } from '../pop-up/pop-up.service';
import { LotusMapper } from './lotus.mapper';
import {
  LotusCalendarDto,
  LotusCalendarReqDto,
  LotusDto,
  LotusRecordDto,
  LotusReqDto,
} from './dtos/lotus.dto';
import { LotusState } from './interfaces/lotus-state.enum';
import * as moment from 'moment';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { LotusOrmService } from '../../../orm/modules/lotuses/lotus-orm.service';
import { LotusRecordOrmService } from '../../../orm/modules/lotuses/records/lotus-record-orm.service';
import { UserHabitDataOrmService } from '../../../orm/modules/users/habit-datas/user-habit-data-orm.service';
import { Op } from 'sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nHelperService } from '../../../shared/modules/i18n/i18n-helper.service';

@Injectable()
export class LotusService {
  constructor(
    private i18n: I18nHelperService,
    private popup: PopUpService,
    private lotus: LotusOrmService,
    private lotusRecord: LotusRecordOrmService,
    private lotusMapper: LotusMapper,
    private userHabitDatas: UserHabitDataOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getLotus(
    i18n: I18nContext,
    { animation = false }: LotusReqDto,
    { userId }: IJWTUser,
  ): Promise<LotusDto> {
    const lotus = new LotusDto();

    const lotusParts = await this.lotus.getAllParts(userId);
    if (!lotusParts.length) {
      return lotus;
    }

    lotusParts.forEach(
      ({ daypart }, i) =>
        (lotus[daypart] =
          animation && i === lotusParts.length - 1 ? LotusState.filling : LotusState.full),
    );

    return lotus;
  }

  async getRecord(i18n: I18nContext, { userId }: IJWTUser): Promise<LotusRecordDto> {
    const lotusRecord = await this.lotusRecord.getOne({
      where: { userId },
      order: [['record', 'DESC']],
    });

    return {
      record: lotusRecord?.record || 0,
    };
  }

  async getCalendar(
    i18n: I18nContext,
    { yearMonth }: LotusCalendarReqDto,
    { userId }: IJWTUser,
  ): Promise<LotusCalendarDto[]> {
    const currentMonth = moment.utc(yearMonth, 'YYYY-MM', true);
    const calendar: LotusCalendarDto[] = [];

    if (!currentMonth.isValid()) {
      throw this.popup.error(i18n, `lotus.wrongDate`);
    }

    const nextMonth = currentMonth.clone().add({ month: 1 });

    for (let i = 1; i <= currentMonth.daysInMonth(); i++) {
      const lotus = new LotusDto();

      calendar.push({
        date: moment.utc(`${yearMonth}-${i}`, 'YYYY-MM-D', true).format('YYYY-MM-DD'),
        lotus,
        notes: [],
      });
    }

    if (currentMonth.diff(moment.utc()) > 0) {
      return calendar;
    }

    const lotusParts = await this.lotus.getAllPartsForCalendar(userId, {
      currentMonth: currentMonth.toDate(),
      nextMonth: nextMonth.toDate(),
    });

    const notes = await this.userHabitDatas.getAll(
      {
        where: {
          userId,
          createdAt: {
            [Op.and]: {
              [Op.gte]: currentMonth.toDate(),
              [Op.lt]: nextMonth.toDate(),
            },
          },
        },
      },
      ['habitNotes'],
    );

    if (lotusParts.length) {
      for (const { daypart, createdAt } of lotusParts) {
        const _calendar = calendar.find(
          (el) => el.date === moment.utc(createdAt).format('YYYY-MM-DD'),
        );
        if (_calendar) {
          _calendar.lotus[daypart] = LotusState.full;
        }
      }
    }

    if (notes.length) {
      for (const { habit, id, createdAt } of notes) {
        const _calendar = calendar.find(
          (el) => el.date === moment.utc(createdAt).format('YYYY-MM-DD'),
        );
        if (_calendar) {
          _calendar.notes.push({
            name: this.i18n.getValue(i18n, habit.i18n, 'name'),
            id,
          });
        }
      }
    }

    return calendar;
  }
}
