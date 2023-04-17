import { ValidationOptions, ValidationArguments, MinLength as _MinLength } from 'class-validator';
import buildMessage from '../../build-message';

export function MinLength(min: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return _MinLength(min, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `количество символов должно быть минимум ${min}`),
  });
}
