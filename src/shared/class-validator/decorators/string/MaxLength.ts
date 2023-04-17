import { ValidationOptions, ValidationArguments, MaxLength as _MaxLength } from 'class-validator';
import buildMessage from '../../build-message';

export function MaxLength(max: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return _MaxLength(max, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `количество символов должно быть максимум ${max}`),
  });
}
