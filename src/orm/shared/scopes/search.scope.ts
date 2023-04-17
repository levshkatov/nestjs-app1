import { Model } from 'sequelize-typescript';
import { FindOptions, ModelStatic, Op, WhereOptions } from 'sequelize';

/**
 * With nested includes there will be error because of where
 */
export const searchScope = <M extends Model>(
  model: ModelStatic<M>,
): ((...args: any[]) => FindOptions<M>) => {
  return (where?: WhereOptions<M>[]) =>
    where?.length
      ? {
          include: {
            model,
            where: {
              [Op.and]: where,
            },
          },
        }
      : {
          include: {
            model,
          },
        };
};
