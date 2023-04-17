import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import buildMessage from '../class-validator/build-message';

export function IsPassword(
  { min, max }: { min: number; max: number },
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const regex = new RegExp(
            `^[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_\`{|}~]{${min},${max}}$`,
            'g',
          );
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return buildMessage(
            propertyName,
            `значение должно быть строкой, содержащей буквы, цифры и спец символы (без пробелов), от ${min} до ${max} символов`,
          );
        },
      },
    });
  };
}
