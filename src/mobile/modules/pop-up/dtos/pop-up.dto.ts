import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PopUpType } from '../interfaces/pop-up-type.enum';
import { ButtonDto } from './button.dto';

export class PopUpDto {
  @ApiProperty({ enum: PopUpType })
  type: PopUpType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [ButtonDto] })
  buttons: ButtonDto[];

  @ApiProperty({ description: 'Массив ошибок для разработчика' })
  errors: string[];

  constructor({
    type = PopUpType.error,
    title,
    description,
    buttons,
    errors = [],
  }: Partial<PopUpDto>) {
    this.type = type;
    this.title = title || 'Ошибка сервера';
    this.description = description || 'Попробуйте позднее';
    this.buttons = buttons || [new ButtonDto({})];
    this.errors = PopUpType.error ? errors : [];
  }
}
