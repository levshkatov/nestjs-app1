import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('AppleSubscriptionNotifications', {
        type: 'foreign key',
        references: {
          table: 'AppleSubscriptions',
          field: 'originalTransactionId',
        },
        fields: ['originalTransactionId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'AppleSubscriptionNotifications_originalTransactionId_fkey',
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
        'AppleSubscriptionNotifications',
        'AppleSubscriptionNotifications_originalTransactionId_fkey',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
