import {
  ValidationOptions,
  ValidationArguments,
  IsUUID as _IsUUID,
  UUIDVersion,
} from 'class-validator';
import buildMessage from '../../build-message';

export function IsUUID(
  version?: UUIDVersion,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _IsUUID(version, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть UUID строкой`),
  });
}
