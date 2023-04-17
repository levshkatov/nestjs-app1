import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { HabitDaypart } from '../habits/interfaces/habit-daypart.enum';
import { MainOrmService } from '../main-orm.service';
import { ILotus, LotusScopesMap } from './interfaces/lotus.interface';
import { Lotus } from './lotus.model';
import { LotusRecord } from './records/lotus-record.model';

@Injectable()
export class LotusOrmService extends MainOrmService<Lotus, LotusScopesMap> {
  constructor(
    @InjectModel(Lotus)
    private lotus: typeof Lotus,

    @InjectModel(LotusRecord)
    private lotusRecord: typeof LotusRecord,
  ) {
    super(lotus);
    logClassName(this.constructor.name, __filename);
  }

  async add(userId: number, daypart: HabitDaypart): Promise<void> {
    const today = Sequelize.literal('current_date');
    const yesterday = Sequelize.literal("(current_date - interval '1 day')::date");

    const lotusPart = await this.lotus.findOne({
      where: {
        userId,
        daypart,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });

    if (lotusPart) {
      lotusPart.changed('updatedAt', true);
      await lotusPart.update({ updatedAt: new Date() });
    } else {
      await this.lotus.create({
        userId,
        daypart,
      });

      const lotusParts = await this.lotus.findAll({
        where: {
          userId,
          createdAt: {
            [Op.gte]: today,
          },
        },
      });

      if (lotusParts.length === 3) {
        const lotusRecord = await this.lotusRecord.findOne({
          where: {
            userId,
            updatedAt: {
              [Op.and]: {
                [Op.gte]: yesterday,
                [Op.lt]: today,
              },
            },
          },
        });

        const isTodayUpdated =
          (await this.lotusRecord.findOne({
            where: {
              userId,
              updatedAt: {
                [Op.gte]: today,
              },
            },
          })) !== null;

        if (!isTodayUpdated) {
          if (!lotusRecord) {
            await this.lotusRecord.create({
              userId,
              record: 1,
            });
          } else {
            await lotusRecord.update({ record: lotusRecord.record + 1 });
          }
        }
      }
    }
  }

  async getAllParts(userId: number): Promise<ILotus[]> {
    return await this.getAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: Sequelize.literal('current_date'),
        },
      },
      order: [['updatedAt', 'ASC']],
    });
  }

  async getAllPartsForCalendar(
    userId: number,
    { currentMonth, nextMonth }: { currentMonth: Date; nextMonth: Date },
  ): Promise<ILotus[]> {
    return await this.getAll({
      where: {
        userId,
        createdAt: {
          [Op.and]: {
            [Op.gte]: currentMonth,
            [Op.lt]: nextMonth,
          },
        },
      },
    });
  }
}
