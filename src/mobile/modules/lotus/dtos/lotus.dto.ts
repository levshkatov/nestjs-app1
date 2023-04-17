import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches } from '../../../../shared/class-validator';
import { booleanTransformer } from '../../../../shared/helpers/boolean-transformer.helper';
import { LotusState } from '../interfaces/lotus-state.enum';

export class LotusDto {
  @ApiProperty({ enum: LotusState })
  morning!: LotusState;

  @ApiProperty({ enum: LotusState })
  day!: LotusState;

  @ApiProperty({ enum: LotusState })
  evening!: LotusState;

  constructor() {
    this.morning = LotusState.empty;
    this.day = LotusState.empty;
    this.evening = LotusState.empty;
  }
}

export class LotusRecordDto {
  @ApiProperty()
  record!: number;
}

class NotesDto {
  @ApiProperty({ description: 'Название привычки' })
  name!: string;

  @ApiPropertyOptional({ description: 'Id привычки с заметками' })
  id!: number;
}

export class LotusCalendarDto {
  @ApiProperty({ description: 'Формат YYYY-MM-DD (Например 2021-06-03)', format: 'date' })
  date!: string;

  @ApiProperty({
    type: LotusDto,
    description: 'Лепестки могут быть только full и empty',
  })
  lotus!: LotusDto;

  @ApiProperty({ type: [NotesDto] })
  notes!: NotesDto[];
}

export class LotusReqDto {
  @ApiPropertyOptional({
    description: 'Анимация последнего выполненного лепестка. По умолчанию false',
  })
  @IsOptional()
  @Transform(booleanTransformer)
  animation?: boolean;
}

export class LotusCalendarReqDto {
  @ApiProperty({
    description: 'Дата должна быть в формате YYYY-MM (например 2021-08)',
  })
  @IsString()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))$/i)
  yearMonth!: string;
}
