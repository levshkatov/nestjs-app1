export type CreationAttributes<
  I extends { createdAt: Date; updatedAt: Date },
  K extends Exclude<RequiredKeys<I>, 'createdAt' | 'updatedAt'> = never,
> = Pick<I, Exclude<RequiredKeys<I>, K | 'createdAt' | 'updatedAt'>> &
  Partial<Pick<I, K | 'createdAt' | 'updatedAt'>>;

export type RequiredAttributes<I> = Pick<I, RequiredKeys<I>>;

export type OptionalAttributes<I> = Pick<I, OptionalKeys<I>>;

export type UpdateAttributes<T> = Partial<GetRequired<T>>;
