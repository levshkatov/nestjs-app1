import { ValidationOptions, ValidationArguments, Matches as _Matches } from 'class-validator';
import buildMessage from '../../build-message';

export function Matches(pattern: RegExp, validationOptions?: ValidationOptions): PropertyDecorator {
  return _Matches(pattern, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно удовлетворять регулярному выражению - ${pattern}`),
  });
}
