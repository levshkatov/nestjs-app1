type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never;
}[keyof T];

type GetRequired<T> = { [K in RequiredKeys<T>]: T[K] };

type GetOptional<T> = { [K in OptionalKeys<T>]: T[K] };

type RemoveNullValues<T, K extends keyof T> = {
  [Key in keyof T]: Key extends K ? NonNullable<T[Key]> : T[Key];
};

type RemoveNullReturnAll<T, K extends keyof T> = RemoveNullValues<T, K> & Omit<T, K>;

type TranslationObject<T extends Record<string, unknown>> = {
  [K in keyof T]: `${K & string}.${keyof T[K] & string}`;
};
type Translation<T extends Record<string, unknown>> =
  TranslationObject<T>[keyof TranslationObject<T>];
