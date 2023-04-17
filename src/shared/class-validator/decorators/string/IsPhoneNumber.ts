import {
  ValidationOptions,
  ValidationArguments,
  IsPhoneNumber as _IsPhoneNumber,
} from 'class-validator';
import buildMessage from '../../build-message';
import { CountryCode } from 'libphonenumber-js';

export function IsPhoneNumber(
  region?: CountryCode,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _IsPhoneNumber(region, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть номером телефона`),
  });
}
