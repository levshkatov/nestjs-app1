import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainOrmService } from '../../main-orm.service';
import { InterestingImage } from './interesting-image.model';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { InterestingImageScopesMap } from './interfaces/interesting-image.interface';

@Injectable()
export class InterestingImageOrmService extends MainOrmService<
  InterestingImage,
  InterestingImageScopesMap
> {
  constructor(
    @InjectModel(InterestingImage)
    private interestingImage: typeof InterestingImage,
  ) {
    super(interestingImage);
    logClassName(this.constructor.name, __filename);
  }
}
