import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, Min } from '../../../class-validator';
import { OffsetUTC } from '../../../interfaces/offset-utc.enum';

export class TokenBaseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  sessionId!: number;
}

export class RefreshTokenReqBaseDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  userId!: number;

  @ApiProperty({ description: 'ID сессии', example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sessionId!: number;

  @ApiProperty({
    description: 'Сдвиг по времени, относительно UTC',
    enum: OffsetUTC,
    example: OffsetUTC['+00:00'],
  })
  @IsEnum(OffsetUTC)
  @IsNotEmpty()
  offsetUTC!: OffsetUTC;
}
