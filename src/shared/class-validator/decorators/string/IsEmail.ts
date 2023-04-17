import { ValidationOptions, ValidationArguments, IsEmail as _IsEmail } from 'class-validator';
import buildMessage from '../../build-message';
import ValidatorJS from 'validator';

export function IsEmail(
  options?: ValidatorJS.IsEmailOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _IsEmail(options, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть email строкой`),
  });
}
