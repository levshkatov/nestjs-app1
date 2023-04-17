import { ValidationOptions, ValidationArguments, IsBase64 as _IsBase64 } from 'class-validator';
import buildMessage from '../../build-message';

export function IsBase64(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsBase64({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть строкой в кодировке base64`),
  });
}
