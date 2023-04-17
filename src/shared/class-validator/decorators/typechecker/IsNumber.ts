import {
  ValidationOptions,
  ValidationArguments,
  IsNumber as _IsNumber,
  IsNumberOptions,
} from 'class-validator';
import buildMessage from '../../build-message';

export function IsNumber(
  options?: IsNumberOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _IsNumber(options, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть числом`),
  });
}
