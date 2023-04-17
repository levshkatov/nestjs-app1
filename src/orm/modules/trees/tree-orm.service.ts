import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../main-orm.service';
import { TreeScopesMap } from './interfaces/tree.interface';
import { Tree } from './tree.model';

@Injectable()
export class TreeOrmService extends MainOrmService<Tree, TreeScopesMap> {
  constructor(
    @InjectModel(Tree)
    private tree: typeof Tree,
  ) {
    super(tree);
    logClassName(this.constructor.name, __filename);
  }
}
