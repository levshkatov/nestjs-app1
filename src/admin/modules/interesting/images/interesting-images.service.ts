import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { InterestingImageOrmService } from '../../../../orm/modules/interesting/images/interesting-image-orm.service';
import { IInterestingImage } from '../../../../orm/modules/interesting/images/interfaces/interesting-image.interface';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import { MediaOrmService } from '../../../../orm/modules/media/media-orm.service';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { OkDto } from '../../../../shared/dtos/responses.dto';
import { createError } from '../../../../shared/helpers/create-error.helper';
import { logClassName } from '../../../../shared/helpers/log-classname.helper';
import { Pagination } from '../../../../shared/interfaces/paginated.interface';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { I18nHelperService } from '../../../../shared/modules/i18n/i18n-helper.service';
import {
  InterestingImagesForListDto,
  InterestingImageCreateReqDto,
  InterestingImageDetailedDto,
  InterestingImageEditReqDto,
  InterestingImagesReqDto,
} from './dtos/interesting-image.dto';
import { InterestingImagesMapper } from './interesting-images.mapper';

@Injectable()
export class InterestingImagesService {
  constructor(
    private i18n: I18nHelperService,
    private images: InterestingImageOrmService,
    private imagesMapper: InterestingImagesMapper,
    private media: MediaOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  async getAll(
    i18n: I18nContext,
    { limit, offset }: Pagination,
  ): Promise<InterestingImagesForListDto> {
    const {
      pages,
      total,
      rows: images,
    } = await this.images.getAllAndCount(
      {
        offset,
        limit,
        order: [['id', 'DESC']],
      },
      ['photo'],
      `"InterestingImage"."id"`,
    );

    return {
      pages,
      total,
      interestingImages: images.map((image) =>
        this.imagesMapper.toInterestingImageForListDto(i18n, image),
      ),
    };
  }

  async create(i18n: I18nContext, { photoId }: InterestingImageCreateReqDto): Promise<OkDto> {
    if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
      throw createError(i18n, 'create', 'media.photoNotFound');
    }

    const image = await this.images.create({
      disabled: true,
      photoId,
    });

    return new OkDto();
  }

  async getOne(i18n: I18nContext, id: number): Promise<InterestingImageDetailedDto> {
    const image = await this.images.getOneFromAll({ where: { id } }, ['photo']);
    if (!image) {
      throw createError(i18n, 'get', 'interesting.notFound');
    }

    return this.imagesMapper.toInterestingImageDetailedDto(i18n, image);
  }

  async edit(
    i18n: I18nContext,
    id: number,
    { photoId, disabled }: InterestingImageEditReqDto,
    { role }: IJWTUser,
  ): Promise<OkDto> {
    const image = await this.images.getOneFromAll({ where: { id } });
    if (!image) {
      throw createError(i18n, 'edit', 'interesting.notFound');
    }

    const imageUpdate: Partial<GetRequired<IInterestingImage>> = {};

    if (photoId !== image.photoId) {
      if (!(await this.media.getOne({ where: { id: photoId, type: MediaType.photo } }))) {
        throw createError(i18n, 'edit', 'media.photoNotFound');
      }
      imageUpdate.photoId = photoId;
    }

    if (disabled !== undefined && disabled !== image.disabled && role === UserRole.webAdmin) {
      imageUpdate.disabled = disabled;
    }

    if (Object.keys(imageUpdate).length) {
      await this.images.update(imageUpdate, { where: { id } });
    }

    return new OkDto();
  }

  async delete(i18n: I18nContext, id: number): Promise<OkDto> {
    if ((await this.images.destroy({ where: { id } })) !== 1) {
      throw createError(i18n, 'delete', 'interesting.notFound');
    }
    return new OkDto();
  }
}
