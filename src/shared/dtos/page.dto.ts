import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min } from '../class-validator';

export class PageReqDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Дефолт: 1. Минимум: 1',
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;
}

export class PagesDto {
  @ApiProperty({ description: 'Общее количество страниц' })
  pages!: number;

  @ApiProperty({ description: 'Общее число элементов' })
  total!: number;
}
