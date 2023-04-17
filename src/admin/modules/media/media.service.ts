import { Injectable } from '@nestjs/common';
import { MediaMapper } from './media.mapper';
import { MediaOrmService } from '../../../orm/modules/media/media-orm.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { I18nContext } from 'nestjs-i18n';
import { MediaCreateReqDto, MediaDto, MediaReqDto } from './dtos/media.dto';
import { ConfigService } from '@nestjs/config';
import { AdminConfig } from '../../../config/interfaces/admin';
import { ErrorDto } from '../../../shared/dtos/responses.dto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { createError } from '../../../shared/helpers/create-error.helper';
import { MediaType } from '../../../orm/modules/media/interfaces/media-type.enum';
import { extname } from 'node:path';
import { MediaExtension } from '../../../orm/modules/media/interfaces/media-extension.enum';
import { randomUUID } from 'node:crypto';
import { UserOrmService } from '../../../orm/modules/users/user-orm.service';
import * as sharp from 'sharp';
import { encode } from 'blurhash';
import { CommonConfig } from '../../../config/interfaces/common';
import { PHOTO_SIZES } from '../../../orm/modules/media/interfaces/media.constants';
import { IMediaPhotoSize } from '../../../orm/modules/media/interfaces/media-photo-size.interface';
import { CreationAttributes } from '../../../orm/shared/interfaces/attributes.interface';

@Injectable()
export class MediaService {
  constructor(
    private config: ConfigService,
    private media: MediaOrmService,
    private mediaMapper: MediaMapper,
    private users: UserOrmService,
  ) {
    logClassName(this.constructor.name, __filename);
  }

  private adminConfig = this.config.get<AdminConfig>('admin')!;
  private commonConfig = this.config.get<CommonConfig>('common')!;
  private s3 = new S3Client({ region: 'eu-central-1' });

  async getOne(i18n: I18nContext, { id, tag }: MediaReqDto): Promise<MediaDto> {
    if (!id && !tag) {
      throw createError(i18n, 'media', 'media.notFound');
    }

    const media = await this.media.getOne({ where: id ? { id } : { tag } }, [
      'photoSizes',
      'author',
    ]);
    if (!media) {
      throw createError(i18n, 'media', 'media.notFound');
    }

    return this.mediaMapper.toMediaDto(i18n, media, media.author);
  }

  async upload(
    i18n: I18nContext,
    { tag }: MediaCreateReqDto,
    { mimetype, originalname, size, buffer }: Express.Multer.File,
    { userId }: IJWTUser,
  ): Promise<MediaDto> {
    const user = await this.users.getOneFromAll({ where: { id: userId } }, ['profile']);
    if (!user) {
      throw createError(i18n, 'media', 'users.notFound');
    }

    const regex = new RegExp(`\.(${this.adminConfig.media.extensions.join('|')})$`);
    if (!regex.test(originalname)) {
      this.throwError(i18n, 'wrongExtension');
    }

    if (size > this.adminConfig.media.size * 1024 * 1024) {
      this.throwError(i18n, 'tooLarge');
    }

    const type = mimetype?.includes('audio')
      ? MediaType.audio
      : mimetype.includes('image')
      ? MediaType.photo
      : null;

    if (!type) {
      throw createError(i18n, 'media', 'media.wrongFileType');
    }

    if (tag) {
      if (await this.media.getOne({ where: { tag } })) {
        throw createError(i18n, 'media', 'media.notUniqueTag');
      }
    }

    const ext = extname(originalname);
    const extension = ext?.slice(1) as MediaExtension;
    if (!extension || !Object.values(MediaExtension).includes(extension)) {
      this.throwError(i18n, 'wrongExtension');
    }

    const filename = `${type}/${randomUUID()}`;

    const src = await this.uploadS3(buffer, `${filename}${ext}`, mimetype);
    if (!src) {
      throw createError(i18n, 'media', 'media.brokenUpload');
    }

    const blurHash = type === MediaType.photo ? await this.encodeImageToBlurhash(buffer) : null;

    const media = await this.media.create({
      tag,
      authorId: userId,
      type,
      extension,
      originalName: originalname,
      size,
      src,
      blurHash,
    });

    const photoSizes =
      type === MediaType.photo
        ? await this.addPhotoSizes(media.id, buffer, { filename, ext, mimetype })
        : undefined;

    return this.mediaMapper.toMediaDto(i18n, { ...media, photoSizes }, user);
  }

  private async uploadS3(file: Buffer, name: string, mimetype: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.s3
        .send(
          new PutObjectCommand({
            Bucket: this.commonConfig.s3.bucketName,
            Key: name,
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
          }),
        )
        .then((data) => {
          if (!data) {
            return resolve(null);
          }
          resolve(
            `https://${this.commonConfig.s3.bucketName}.${this.commonConfig.s3.endpoint}/${name}`,
          );
        })
        .catch((err) => {
          return resolve(null);
        });
    });
  }

  private async addPhotoSizes(
    photoId: number,
    file: Buffer,
    { filename, ext, mimetype }: { filename: string; ext: string; mimetype: string },
  ): Promise<IMediaPhotoSize[] | undefined> {
    const { width, height } = await sharp(file).metadata();
    if (!width || !height) {
      return undefined;
    }

    const maxDimension = width > height ? width : height;
    const sizes = PHOTO_SIZES.filter((size) => size <= maxDimension);

    const photoSizes: CreationAttributes<IMediaPhotoSize, 'id'>[] = [];

    for (const size of sizes) {
      const buffer = await this.resizeImage(file, size, size, 'inside');
      if (!buffer) {
        continue;
      }

      const src = await this.uploadS3(buffer, `${filename}-${size}${ext}`, mimetype);
      if (!src) {
        continue;
      }

      photoSizes.push({
        photoId,
        size,
        src,
      });
    }

    if (!photoSizes.length) {
      return undefined;
    }

    return this.media.createPhotoSizes(photoSizes);
  }

  private async resizeImage(
    buff: Buffer,
    w: number,
    h: number,
    fit: keyof sharp.FitEnum,
  ): Promise<Buffer | null> {
    return new Promise((resolve) => {
      sharp(buff)
        .ensureAlpha()
        .resize(w, h, { fit })
        .toBuffer((err, buffer) => {
          if (err) return resolve(null);
          resolve(buffer);
        });
    });
  }

  private async encodeImageToBlurhash(buff: Buffer): Promise<string | null> {
    return new Promise((resolve) => {
      sharp(buff)
        .raw()
        .ensureAlpha()
        .resize(32, 32, { fit: 'inside' })
        .toBuffer((err, buffer, { width, height }) => {
          if (err) return resolve(null);
          resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
        });
    });
  }

  private throwError(i18n: I18nContext, type: 'wrongExtension' | 'tooLarge') {
    const errors =
      type === 'wrongExtension'
        ? [
            i18n.t('errors.media.wrongExtension', {
              args: { extensions: this.adminConfig.media.extensions.join(', ') },
            }),
          ]
        : [i18n.t('errors.media.tooLarge', { args: { size: this.adminConfig.media.size } })];

    throw createError(i18n, 'media', null, errors);
  }
}
