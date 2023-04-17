import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'HabitCategoryBalances',
        'HabitCategoryBalances_habitCategoryId_fkey',
        { transaction },
      );

      await queryInterface.addConstraint('HabitCategoryBalances', {
        type: 'foreign key',
        references: {
          table: 'HabitCategories',
          field: 'id',
        },
        fields: ['habitCategoryId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'HabitCategoryBalances',
        'HabitCategoryBalances_habitCategoryId_fkey',
        { transaction },
      );

      await queryInterface.addConstraint('HabitCategoryBalances', {
        type: 'foreign key',
        references: {
          table: 'HabitCategories',
          field: 'id',
        },
        fields: ['habitCategoryId'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
