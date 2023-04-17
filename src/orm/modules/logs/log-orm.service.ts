import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../main-orm.service';
import { LogScopesMap } from './interfaces/log.interface';
import { Log } from './log.model';

@Injectable()
export class LogOrmService extends MainOrmService<Log, LogScopesMap> {
  constructor(
    @InjectModel(Log)
    private log: typeof Log,
  ) {
    super(log);
    logClassName(this.constructor.name, __filename);
  }
}
