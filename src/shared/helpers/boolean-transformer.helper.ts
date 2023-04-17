export const booleanTransformer = ({ value }: { value: any }): boolean => {
  return typeof value === 'boolean'
    ? value
    : typeof value === 'string' && value == 'true'
    ? true
    : false;
};
