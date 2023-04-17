import { ApiProperty } from '@nestjs/swagger';
import { HomeScreenType } from '../interfaces/home-screen-type.enum';

export class HomeScreenDto {
  @ApiProperty({ enum: HomeScreenType })
  type: HomeScreenType;

  constructor({ type }: HomeScreenDto) {
    this.type = type;
  }
}
