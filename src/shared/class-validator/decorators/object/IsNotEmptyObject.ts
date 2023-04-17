import {
  ValidationOptions,
  ValidationArguments,
  IsNotEmptyObject as _IsNotEmptyObject,
} from 'class-validator';
import buildMessage from '../../build-message';

export function IsNotEmptyObject(
  options?: {
    nullable?: boolean;
  },
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return _IsNotEmptyObject(options, {
    ...validationOptions,
    message: ({ property }: ValidationArguments) =>
      buildMessage(property, `значение должно быть не пустым объектом`),
  });
}
