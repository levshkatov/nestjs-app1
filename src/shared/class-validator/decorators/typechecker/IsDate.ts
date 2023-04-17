import { ValidationOptions, ValidationArguments, IsDate as _IsDate } from 'class-validator';
import buildMessage from '../../build-message';

export function IsDate(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsDate({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть датой`),
  });
}
