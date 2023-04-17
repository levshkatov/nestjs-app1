import { ValidationOptions, IsOptional as _IsOptional } from 'class-validator';

export function IsOptional(validationOptions?: ValidationOptions): PropertyDecorator {
  return _IsOptional({
    ...validationOptions,
  });
}
