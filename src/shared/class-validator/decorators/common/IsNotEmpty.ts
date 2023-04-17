import { ValidationOptions, ValidationArguments, IsNotEmpty as _IsNotEmpty } from 'class-validator';
import buildMessage from '../../build-message';

export function IsNotEmpty(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsNotEmpty({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение не может быть '', null, undefined`),
  });
}
