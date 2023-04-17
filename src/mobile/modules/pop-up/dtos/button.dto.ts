import { ApiProperty } from '@nestjs/swagger';
import { ButtonName } from '../interfaces/button-name.enum';

export class ButtonDto {
  @ApiProperty({ enum: ButtonName })
  name?: ButtonName;

  @ApiProperty()
  text?: string;

  constructor({ name, text }: ButtonDto) {
    this.name = name || ButtonName.cancel;
    this.text = text || 'Отменить';
  }
}
