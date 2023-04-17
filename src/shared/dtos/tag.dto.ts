import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from '../class-validator';
import { apiSetLength } from '../helpers/api-set-length.helper';

export class TagReqDto {
  @ApiProperty({
    ...apiSetLength(3, 200, 'Тег объекта'),
  })
  @IsString()
  @Length(3, 200)
  tag!: string;
}
