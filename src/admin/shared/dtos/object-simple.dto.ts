import { ApiProperty } from '@nestjs/swagger';

export class ObjectSimpleDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;
}
