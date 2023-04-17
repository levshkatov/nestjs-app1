import { Op, Sequelize } from 'sequelize';

export const whereColILike = (
  { col, table }: { col: string; table?: string },
  val: string | number,
  cast?: string,
) => {
  const column = Sequelize.col(table ? `"${table}"."${col}"` : col);
  const searchValue = { [Op.iLike]: `%${val}%` };
  return Sequelize.where(cast ? Sequelize.cast(column, cast) : column, searchValue);
};
