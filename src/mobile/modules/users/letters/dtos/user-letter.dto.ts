import { ApiProperty } from '@nestjs/swagger';

export class UserLetterDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}
