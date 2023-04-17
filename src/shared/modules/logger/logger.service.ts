import { Injectable } from '@nestjs/common';
import { Sequelize, WhereOptions, Op } from 'sequelize';
import { ILog } from '../../../orm/modules/logs/interfaces/log.interface';
import { LogOrmService } from '../../../orm/modules/logs/log-orm.service';
import { logClassName } from '../../helpers/log-classname.helper';
import { LoggerReqDto } from './dtos/logger.dto';
import { Sequelize as SequelizeTS } from 'sequelize-typescript';
import { whereColILike } from '../../../orm/shared/helpers/where-col-like.helper';

@Injectable()
export class LoggerService {
  constructor(private logs: LogOrmService, private sequelize: SequelizeTS) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll({
    id,
    ipAddr,
    method,
    url,
    userId,
    username,
    role,
    resStatus,
    reqType,
    offset,
    limit,
    include404 = false,
    errors,
  }: LoggerReqDto) {
    const whereOptions: WhereOptions<ILog>[] = [];

    if (ipAddr) {
      whereOptions.push(whereColILike({ col: 'ipAddr' }, ipAddr));
    }

    if (method) {
      whereOptions.push(whereColILike({ col: 'method' }, method));
    }

    if (url) {
      whereOptions.push(whereColILike({ col: 'url' }, url));
    }

    if (userId) {
      whereOptions.push({ userId });
    }

    if (username) {
      whereOptions.push(whereColILike({ col: 'username' }, username));
    }

    if (role) {
      whereOptions.push(whereColILike({ col: 'role' }, role));
    }

    if (resStatus) {
      whereOptions.push({
        resStatus: !include404 ? { [Op.and]: { [Op.eq]: resStatus, [Op.ne]: 404 } } : resStatus,
      });
    } else if (!include404) {
      whereOptions.push({ resStatus: { [Op.ne]: 404 } });
    }

    if (reqType) {
      whereOptions.push(whereColILike({ col: 'reqType' }, reqType));
    }

    if (id) {
      whereOptions.push(whereColILike({ col: 'id' }, id, 'text'));
    }

    if (errors) {
      whereOptions.push(
        Sequelize.literal(
          `exists (select * from unnest("Log"."errors") n where n like ${this.sequelize.escape(
            `%${errors}%`,
          )})`,
        ),
      );
    }

    return this.logs.getAll({
      where: {
        [Op.and]: whereOptions,
      },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async get(id: number) {
    return await this.logs.getOne({ where: { id } });
  }

  async getPretty(id: number): Promise<any> {
    const log = await this.logs.getOne({ where: { id } });
    if (!log) {
      return {};
    }

    log.reqBody = log.reqBody ? JSON.parse(log.reqBody) : null;
    return log;
  }

  async error(errors: string[]): Promise<ILog | null> {
    return await this.logs.create({
      errors,
      resStatus: 500,
      ipAddr: null,
      method: null,
      url: null,
      userId: null,
      username: null,
      role: null,
      reqLength: null,
      resLength: null,
      resStatusMessage: null,
      resTime: null,
      reqType: null,
      reqBody: null,
      extra: null,
      serverError: null,
    });
  }
}
