import {
  ValidationOptions,
  ValidationArguments,
  ArrayMinSize as _ArrayMinSize,
} from 'class-validator';
import buildMessage from '../../build-message';

export function ArrayMinSize(
  min: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _ArrayMinSize(min, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `массив должен содержать минимум ${min} элементов`),
  });
}
