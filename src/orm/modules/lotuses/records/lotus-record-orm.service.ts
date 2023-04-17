import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../../main-orm.service';
import { LotusRecordScopesMap } from './interfaces/lotus-record.interface';
import { LotusRecord } from './lotus-record.model';

@Injectable()
export class LotusRecordOrmService extends MainOrmService<LotusRecord, LotusRecordScopesMap> {
  constructor(
    @InjectModel(LotusRecord)
    private lotusRecord: typeof LotusRecord,
  ) {
    super(lotusRecord);
    logClassName(this.constructor.name, __filename);
  }
}
