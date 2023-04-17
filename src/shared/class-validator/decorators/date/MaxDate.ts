import { ValidationOptions, ValidationArguments, MaxDate as _MaxDate } from 'class-validator';
import buildMessage from '../../build-message';

export function MaxDate(date: Date, validationOptions?: ValidationOptions): PropertyDecorator {
  return _MaxDate(date, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть меньше ${date}`),
  });
}
