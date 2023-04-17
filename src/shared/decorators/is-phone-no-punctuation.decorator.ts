import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import buildMessage from '../class-validator/build-message';

export function IsPhoneNoPunctuation(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNoPunctuation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && !/[\s|\(|\)|-]/g.test(value) && /^\+/g.test(value);
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return buildMessage(
            propertyName,
            `значение должно содержать только цифры и знак + в начале`,
          );
        },
      },
    });
  };
}
