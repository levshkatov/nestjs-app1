import { ValidationOptions, ValidationArguments, Max as _Max } from 'class-validator';
import buildMessage from '../../build-message';

export function Max(maxValue: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return _Max(maxValue, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть не больше ${maxValue}`),
  });
}
