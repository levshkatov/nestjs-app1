import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { TreeOrmService } from '../../../orm/modules/trees/tree-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { PopUpService } from '../pop-up/pop-up.service';
import { TreeDto } from './dtos/tree.dto';
import { MAX_TREE_INDEX, MIN_TREE_INDEX, TREE_DURATION } from './interfaces/tree.constants';
import { TreesMapper } from './trees.mapper';

@Injectable()
export class TreesService {
  constructor(
    private popup: PopUpService,
    private trees: TreeOrmService,
    private treesMapper: TreesMapper,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async get(i18n: I18nContext, totalTasks: number): Promise<TreeDto> {
    const calcIndex = Math.floor(totalTasks / TREE_DURATION) + 1;
    const index =
      calcIndex < MIN_TREE_INDEX
        ? MIN_TREE_INDEX
        : calcIndex > MAX_TREE_INDEX
        ? MAX_TREE_INDEX
        : calcIndex;

    const tree = await this.trees.getOneFromAll({ where: { index } }, ['i18n', 'photo']);

    if (!tree) {
      throw this.popup.error(i18n, `e.commonError`);
    }

    return this.treesMapper.toTreeDto(i18n, tree);
  }
}
