import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  // @ApiPropertyOptional()
  // phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({ format: 'date' })
  birthdate?: Date;
}
