import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MediaExtension } from '../../../../orm/modules/media/interfaces/media-extension.enum';
import { MediaType } from '../../../../orm/modules/media/interfaces/media-type.enum';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  NotContains,
} from '../../../class-validator';
import { apiSetLength } from '../../../helpers/api-set-length.helper';
import { PhotoSizeDto } from './photo-size.dto';

export class MediaBaseDto {
  @ApiProperty()
  id!: number;

  @ApiPropertyOptional({ description: 'Уникальный тег файла' })
  tag?: string;

  @ApiProperty({ enum: MediaType })
  type!: MediaType;

  @ApiProperty({ enum: MediaExtension })
  extension!: MediaExtension;

  @ApiProperty()
  src!: string;

  @ApiPropertyOptional({ description: 'Только для изображений' })
  blurHash?: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiPropertyOptional({
    description: 'Только для изображений. Ссылки на кадрированные изображения',
    type: PhotoSizeDto,
  })
  resized?: PhotoSizeDto;
}

export class MediaReqBaseDto {
  @ApiPropertyOptional({
    description: 'ID файла. Если указан, то тег игнорируется',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional({
    ...apiSetLength(null, 200, 'Тег файла без пробелов'),
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @NotContains(' ')
  tag?: string;
}
