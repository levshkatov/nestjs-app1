import {
  ValidationOptions,
  ValidationArguments,
  ArrayMaxSize as _ArrayMaxSize,
} from 'class-validator';
import buildMessage from '../../build-message';

export function ArrayMaxSize(
  max: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _ArrayMaxSize(max, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `массив должен содержать максимум ${max} элементов`),
  });
}
