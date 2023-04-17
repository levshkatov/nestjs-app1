import { ValidationOptions, ValidationArguments, IsString as _IsString } from 'class-validator';
import buildMessage from '../../build-message';

export function IsString(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsString({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть строкой`),
  });
}
