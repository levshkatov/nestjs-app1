import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attributes, BulkCreateOptions, CreationAttributes } from 'sequelize';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { MainOrmService } from '../main-orm.service';
import { MediaScopesMap } from './interfaces/media.interface';
import { MediaPhotoSize } from './media-photo-size.model';
import { Media } from './media.model';

@Injectable()
export class MediaOrmService extends MainOrmService<Media, MediaScopesMap> {
  constructor(
    @InjectModel(Media)
    private media: typeof Media,

    @InjectModel(MediaPhotoSize)
    private mediaPhotoSize: typeof MediaPhotoSize,
  ) {
    super(media);
    logClassName(this.constructor.name, __filename);
  }

  async createPhotoSizes(
    records: ReadonlyArray<CreationAttributes<MediaPhotoSize>>,
    options?: BulkCreateOptions<Attributes<MediaPhotoSize>>,
  ): Promise<Attributes<MediaPhotoSize>[]> {
    return MainOrmService.bulkCreate(this.mediaPhotoSize, records, options);
  }
}
