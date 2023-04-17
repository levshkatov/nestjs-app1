import { ApiProperty } from '@nestjs/swagger';

export class UserWaterBalanceDto {
  @ApiProperty()
  waterBalance!: number;

  constructor({ waterBalance }: UserWaterBalanceDto) {
    this.waterBalance = waterBalance;
  }
}
