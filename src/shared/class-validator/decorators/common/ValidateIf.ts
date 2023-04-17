import { ValidationOptions, ValidationArguments, ValidateIf as _ValidateIf } from 'class-validator';
import buildMessage from '../../build-message';

export function ValidateIf(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _ValidateIf(condition, validationOptions);
}
