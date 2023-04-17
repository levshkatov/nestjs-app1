import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Habits',
        'index',
        { allowNull: false, type: DataTypes.INTEGER, defaultValue: 1000 },
        { transaction },
      );

      await queryInterface.addColumn(
        'Habits',
        'tag',
        { allowNull: true, unique: true, type: DataTypes.TEXT },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Habits', 'index', { transaction });
      await queryInterface.removeColumn('Habits', 'tag', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
