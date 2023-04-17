import { ScopeOptions } from 'sequelize';
import { ScopesOptions } from 'sequelize-typescript';
import { RequiredAttributes } from './attributes.interface';

export type TScopes<I, Scopes extends ModelScopes<I>> = { [key in keyof Scopes]: ScopesOptions };

export interface IScopeOption<T extends string> extends ScopeOptions {
  method: T | readonly [T, ...unknown[]];
}

export type ModelScopes<T> = {
  [key: string]: [OptionalKeys<T>, object | null | undefined];
};

export type BuildScope<I, Scopes extends ModelScopes<I>, K extends keyof Scopes = never> = {
  [key in RequiredKeys<I>]: I[key];
} & {
  [key in K as Scopes[key][0]]: Scopes[key][1] extends undefined
    ? NonNullable<I[Scopes[key][0]]>
    : Scopes[key][1];
};

export type BS<I, Scopes extends ModelScopes<I>, K extends keyof Scopes = never> = BuildScope<
  I,
  Scopes,
  K
>;

export type Through<P extends string, T> = {
  [key in P]?: RequiredAttributes<T>;
};

export type ThroughR<P extends string, T> = {
  [key in P]: RequiredAttributes<T>;
};
