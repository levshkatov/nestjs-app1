import {
  ValidationOptions,
  ValidationArguments,
  NotContains as _NotContains,
} from 'class-validator';
import buildMessage from '../../build-message';

export function NotContains(
  seed: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _NotContains(seed, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение не может содержать ${seed}`),
  });
}
