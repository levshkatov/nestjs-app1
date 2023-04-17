import { ValidationOptions, ValidationArguments, IsEnum as _IsEnum } from 'class-validator';
import buildMessage from '../../build-message';

export function IsEnum(entity: object, validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsEnum(entity, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть свойством enum`),
  });
}
