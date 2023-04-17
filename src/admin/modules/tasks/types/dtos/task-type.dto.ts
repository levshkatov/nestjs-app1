import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length } from '../../../../../shared/class-validator';
import { apiSetLength } from '../../../../../shared/helpers/api-set-length.helper';

export class TaskTypeSimpleDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiPropertyOptional({ description: 'Описание, что должно быть внутри поля data' })
  dataDescription?: string;

  @ApiPropertyOptional({ description: 'Дефолтное значение для input в админке' })
  dataDefault?: string;

  @ApiProperty({ description: 'Если true, то data не может быть null' })
  dataRequired!: boolean;

  @ApiPropertyOptional({
    description:
      'Если не null, то поле data должно содержать ссылку на файл с доступным расширением',
  })
  files?: string[];
}

export class TaskTypeIncludeDto extends TaskTypeSimpleDto {
  @ApiProperty({ description: 'Максимально допустимое количество данных элементов' })
  maxElements!: number;

  @ApiProperty({ description: 'Если true, то данный TaskType должен присутствовать' })
  required!: boolean;

  @ApiPropertyOptional({
    description: 'Содержит TaskTypes которые не могут находиться одновременно с выбранным',
  })
  taskTypesExcluded?: string[];
}

export class TaskTypeDto extends TaskTypeSimpleDto {
  @ApiProperty({
    type: [TaskTypeIncludeDto],
    description: 'Доступные TaskTypes, которые могут быть в include',
  })
  include!: TaskTypeIncludeDto[];
}

export class TaskTypeDetailedDto extends TaskTypeIncludeDto {
  @ApiProperty({
    type: [TaskTypeIncludeDto],
    description: 'Доступные TaskTypes, которые могут быть в include',
  })
  include!: TaskTypeIncludeDto[];
}

export class TaskTypeReqDto {
  @ApiProperty({ ...apiSetLength(3, 100) })
  @IsString()
  @Length(3, 100)
  name!: string;
}
