import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from '../../../../shared/class-validator';
import { Lang } from '../../../interfaces/lang.enum';

export class DataWithTypeDto {
  @ApiProperty({ description: 'Название типа задания' })
  type!: string;

  @ApiPropertyOptional({
    description: 'Данные в виде строки',
  })
  data?: string;

  @ApiPropertyOptional({
    type: [DataWithTypeDto],
    description: 'Массив объектов type+data+include',
  })
  include?: DataWithTypeDto[];
}

// TODO Set max length
export class DataWithTypeReqDto {
  @ApiProperty({ description: 'Название типа задания' })
  @IsNotEmpty()
  @IsString()
  type!: string;

  @ApiPropertyOptional({
    description: 'Данные в виде строки',
  })
  @IsOptional()
  @IsString()
  data?: string;

  @ApiPropertyOptional({
    type: [DataWithTypeReqDto],
    description: 'Массив объектов type+data+include',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataWithTypeReqDto)
  include?: DataWithTypeReqDto[];
}

export class ContentReqDto {
  @ApiProperty({
    type: [DataWithTypeReqDto],
    description: 'Массив объектов type+data+include',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataWithTypeReqDto)
  content!: DataWithTypeReqDto[];
}

export class TaskErrorDto {
  @ApiProperty({ enum: Lang })
  lang!: Lang;

  @ApiProperty()
  categoryName!: string;

  @ApiProperty()
  nestingLevel!: number;

  @ApiPropertyOptional()
  msg?: string;

  @ApiPropertyOptional()
  taskType?: string;

  @ApiPropertyOptional()
  taskTypeInclude?: string;
}
