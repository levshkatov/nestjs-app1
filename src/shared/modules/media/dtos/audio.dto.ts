import { ApiProperty } from '@nestjs/swagger';

export class AudioDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  src!: string;
}
