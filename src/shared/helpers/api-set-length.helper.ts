import { omitNullProps } from './omit-null-props.helper';

export const apiSetLength = (
  minLength?: number | null,
  maxLength?: number | null,
  description?: string,
): { minLength?: number; maxLength?: number; description: string } => ({
  ...omitNullProps({ minLength, maxLength }),
  description: description
    ? `${description}. Длина в пределах [${minLength || `any`}, ${maxLength || `any`}]`
    : `Длина в пределах [${minLength || `any`}, ${maxLength || `any`}]`,
});
