import { ValidationOptions, ValidationArguments, IsArray as _IsArray } from 'class-validator';
import buildMessage from '../../build-message';

export function IsArray(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsArray({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть массивом`),
  });
}
