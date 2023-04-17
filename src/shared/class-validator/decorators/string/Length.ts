import { ValidationOptions, ValidationArguments, Length as _Length } from 'class-validator';
import buildMessage from '../../build-message';

export function Length(
  min: number,
  max?: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _Length(min, max, {
    ...validationOptions,
    message: ({ property, value }: ValidationArguments) =>
      buildMessage(
        property,
        `значение должно быть в пределах ${min ? min : -Infinity}, ${max ? max : Infinity}`,
      ),
  });
}
