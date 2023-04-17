import { ValidationOptions, ValidationArguments, IsJWT as _IsJWT } from 'class-validator';
import buildMessage from '../../build-message';

export function IsJWT(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsJWT({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть jwt строкой`),
  });
}
