import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import buildMessage from '../class-validator/build-message';

export function IsTime(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
          return typeof value === 'string' && timeRegex.test(value);
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return buildMessage(propertyName, `значение должно быть в формате HH:mm:ss`);
        },
      },
    });
  };
}
