import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Courses',
        'index',
        { allowNull: false, type: DataTypes.INTEGER, defaultValue: 1000 },
        { transaction },
      );

      await queryInterface.addColumn(
        'Courses',
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
      await queryInterface.removeColumn('Courses', 'index', { transaction });
      await queryInterface.removeColumn('Courses', 'tag', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
