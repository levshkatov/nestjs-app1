import {
  ValidationOptions,
  ValidationArguments,
  ValidateNested as _ValidateNested,
} from 'class-validator';
import buildMessage from '../../build-message';

export function ValidateNested(validationOptions?: ValidationOptions): PropertyDecorator {
  return _ValidateNested({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `вложенный объект/массив неверного типа`),
  });
}
