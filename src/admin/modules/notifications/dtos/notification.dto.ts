import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { NotificationType } from '../../../../orm/modules/notifications/interfaces/notification-type.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from '../../../../shared/class-validator';
import { PagesDto } from '../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { Lang } from '../../../../shared/interfaces/lang.enum';

class NotificationBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: NotificationType })
  type!: NotificationType;
}

export class NotificationForListDto extends NotificationBaseDto {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  text!: string;
}

export class NotificationsForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [NotificationForListDto] })
  notifications!: NotificationForListDto[];
}

export class NotificationI18nDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  text!: string;
}

export class NotificationDetailedDto extends NotificationBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [NotificationI18nDto] })
  translations!: NotificationI18nDto[];
}

export class NotificationsReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional({ enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}

export class NotificationI18nReqDto {
  @ApiProperty({
    description: 'Локаль перевода',
    example: Lang.ru,
    enum: Lang,
  })
  @IsNotEmpty()
  @IsEnum(Lang)
  lang!: Lang;

  @ApiProperty({
    example: 'Заголовок',
    ...apiSetLength(3, 44),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 44)
  title!: string;

  @ApiProperty({
    example: 'Текст уведомления',
    ...apiSetLength(3, 134),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 134)
  text!: string;
}

export class NotificationCreateReqDto {
  @ApiProperty({
    enum: NotificationType,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiProperty({
    type: [NotificationI18nReqDto],
    description: 'Обязателен дефолтный перевод ru',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationI18nReqDto)
  translations!: NotificationI18nReqDto[];
}

export class NotificationEditReqDto extends NotificationCreateReqDto {}
