import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from '../../../class-validator';
import { booleanTransformer } from '../../../helpers/boolean-transformer.helper';

export class LoggerReqDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'мин: 0',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  offset?: number = 0;

  @ApiPropertyOptional({
    type: Number,
    description: 'мин: 1, макс: 5000',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5000)
  @Type(() => Number)
  @IsNotEmpty()
  limit?: number = 100;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  ipAddr?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  resStatus?: number;

  @IsOptional()
  @IsString()
  reqType?: string;

  @IsOptional()
  @Transform(booleanTransformer)
  include404?: boolean;

  @IsOptional()
  @IsString()
  errors?: string;
}
