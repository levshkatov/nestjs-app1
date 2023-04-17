import { IScopeOption } from '../interfaces/scopes.interface';

export const buildScopeOptions = <ScopeName extends string>(
  scopes?: ScopeName[] | IScopeOption<ScopeName>[],
  // ): [ScopeName[], IScopeOption<ScopeName>[]] => {
): IScopeOption<ScopeName>[] => {
  if (!scopes?.length) {
    return [];
  }

  if (typeof scopes[0] === 'string') {
    const scopeOptions: IScopeOption<ScopeName>[] = (scopes as ScopeName[]).map((name) => ({
      method: name,
    }));
    // return [scopes as ScopeName[], scopeOptions];
    return scopeOptions;
  }

  // const scopeNames = (scopes as IScopeOption<ScopeName>[]).map(({ method }) =>
  //   typeof method === 'string' ? (method as ScopeName) : (method[0] as ScopeName),
  // );

  // return [scopeNames, scopes as IScopeOption<ScopeName>[]];
  return scopes as IScopeOption<ScopeName>[];
};
