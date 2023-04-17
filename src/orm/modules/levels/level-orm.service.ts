import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../main-orm.service';
import { LevelScopesMap } from './interfaces/level.interface';
import { Level } from './level.model';

@Injectable()
export class LevelOrmService extends MainOrmService<Level, LevelScopesMap> {
  constructor(
    @InjectModel(Level)
    private level: typeof Level,
  ) {
    super(level);
    logClassName(this.constructor.name, __filename);
  }
}
