import { ValidationOptions, ValidationArguments, IsBoolean as _IsBoolean } from 'class-validator';
import buildMessage from '../../build-message';

export function IsBoolean(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsBoolean({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть булевым`),
  });
}
