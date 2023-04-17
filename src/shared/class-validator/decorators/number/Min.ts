import { ValidationOptions, ValidationArguments, Min as _Min } from 'class-validator';
import buildMessage from '../../build-message';

export function Min(minValue: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return _Min(minValue, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть не меньше ${minValue}`),
  });
}
