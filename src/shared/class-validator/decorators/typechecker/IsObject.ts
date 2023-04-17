import { ValidationOptions, ValidationArguments, IsObject as _IsObject } from 'class-validator';
import buildMessage from '../../build-message';

export function IsObject(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsObject({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть объектом`),
  });
}
