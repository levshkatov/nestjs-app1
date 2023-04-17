import { ValidationOptions, ValidationArguments, NotEquals as _NotEquals } from 'class-validator';
import buildMessage from '../../build-message';

export function NotEquals(
  comparison: any,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _NotEquals(comparison, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение не может равняться ${comparison}`),
  });
}
