import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('AppleSubscriptions', {
        type: 'foreign key',
        references: {
          table: 'Users',
          field: 'id',
        },
        fields: ['userId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'AppleSubscriptions_userId_fkey',
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
        'AppleSubscriptions',
        'AppleSubscriptions_userId_fkey',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
