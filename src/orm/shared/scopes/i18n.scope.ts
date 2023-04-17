import { Model, ScopesOptions } from 'sequelize-typescript';
import { ModelStatic } from 'sequelize';

export const i18nScope = <M extends Model>(model: ModelStatic<M>): ScopesOptions => {
  return () => ({
    include: {
      model: model.unscoped(),
    },
  });
};
