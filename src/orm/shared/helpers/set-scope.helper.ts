import { ModelStatic } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { IScopeOption } from '../interfaces/scopes.interface';
import { buildScopeOptions } from './build-scope-options.helper';

/**
 * Sets scopes or clears previous scope
 */
export const setScope = <M extends Model, TScope extends string>(
  model: ModelStatic<M>,
  scopes?: TScope[] | IScopeOption<TScope>[],
): ModelStatic<M> => {
  if (!scopes?.length) {
    return model.scope();
  }

  return model.scope(buildScopeOptions<TScope>(scopes));
};
