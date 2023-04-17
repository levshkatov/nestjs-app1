import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { LevelOrmService } from '../../../orm/modules/levels/level-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { PopUpService } from '../pop-up/pop-up.service';
import { LevelDto } from './dtos/level.dto';
import { LEVEL_DURATION, MAX_LEVEL_INDEX, MIN_LEVEL_INDEX } from './interfaces/level.constants';
import { LevelsMapper } from './levels.mapper';

@Injectable()
export class LevelsService {
  constructor(
    private popup: PopUpService,
    private levels: LevelOrmService,
    private levelsMapper: LevelsMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async get(i18n: I18nContext, totalTasks: number): Promise<LevelDto> {
    let index = Math.floor(totalTasks / LEVEL_DURATION) + 1;
    index =
      index < MIN_LEVEL_INDEX ? MIN_LEVEL_INDEX : index > MAX_LEVEL_INDEX ? MAX_LEVEL_INDEX : index;

    const level = await this.levels.getOneFromAll({ where: { index } }, ['i18n', 'photo']);

    if (!level) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    return this.levelsMapper.toLevelDto(i18n, level);
  }
}
