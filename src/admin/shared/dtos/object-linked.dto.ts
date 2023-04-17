import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectLinkedType } from '../interfaces/object-linked-type.enum';
import { ObjectSimpleDto } from './object-simple.dto';

export class ObjectLinkedDto {
  @ApiProperty({
    enum: ObjectLinkedType,
    description: 'Тип объекта',
  })
  type!: ObjectLinkedType;

  @ApiProperty({ description: 'Текст для отображения' })
  text!: string;

  @ApiProperty({ description: 'Запрос для подробного просмотра объекта' })
  url!: string;

  // Нигде в коде не используется
  @ApiPropertyOptional({
    deprecated: true,
    description:
      'Если true, открывать в новой вкладке. Если false или undefined - в модальном окне',
  })
  inNewTab?: boolean;

  @ApiPropertyOptional({
    type: ObjectSimpleDto,
    description: 'Если у объекта нет id, то он равен 0. Если нет name то равно пустой строке',
  })
  simple?: ObjectSimpleDto;
}
