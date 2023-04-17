import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class OkDto extends MessageDto {
  @ApiProperty({ example: 'OK' })
  message: string;

  constructor() {
    super('OK');
    this.message = 'OK';
  }
}

export class ErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Заголовок ошибки' })
  title: string;

  @ApiProperty({
    example: ['Описания ошибок'],
    type: [String],
  })
  errors: string[];

  constructor({ statusCode = 400, title = 'Ошибка сервера', errors = [] }: Partial<ErrorDto>) {
    this.statusCode = statusCode || 400;
    this.title = title || 'Ошибка сервера';
    this.errors = errors || [];
  }
}

export class UnauthorizedDto {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: ['Ошибка авторизации'] })
  errors!: string[];
}

export class ForbiddenDto {
  @ApiProperty({ example: 403 })
  statusCode!: number;

  @ApiProperty({ example: ['Нет прав доступа'] })
  errors!: string[];
}

export class UnsubscribedDto {
  @ApiProperty({ example: 402 })
  statusCode!: number;

  @ApiProperty({ example: ['Необходима подписка'] })
  errors!: string[];
}
