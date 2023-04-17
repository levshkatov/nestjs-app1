import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('UserCourses', 'exerciseIsCompletedToday', { transaction });

      await queryInterface.addColumn(
        'UserCourses',
        'exercisesCompletedToday',
        { allowNull: false, type: DataTypes.INTEGER, defaultValue: 0 },
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
      await queryInterface.removeColumn('UserCourses', 'exercisesCompletedToday', { transaction });

      await queryInterface.addColumn(
        'UserCourses',
        'exerciseIsCompletedToday',
        { allowNull: false, type: DataTypes.BOOLEAN },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
