import {
  ValidationOptions,
  ValidationArguments,
  IsMilitaryTime as _IsMilitaryTime,
} from 'class-validator';
import buildMessage from '../../build-message';

export function IsMilitaryTime(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsMilitaryTime({
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть в формате HH:mm`),
  });
}
