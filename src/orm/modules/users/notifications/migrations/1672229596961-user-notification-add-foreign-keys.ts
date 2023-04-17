import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('UserNotifications', {
        type: 'foreign key',
        references: {
          table: 'Users',
          field: 'id',
        },
        fields: ['userId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'UserNotifications_userId_fkey',
        transaction,
      });

      await queryInterface.addConstraint('UserNotifications', {
        type: 'foreign key',
        references: {
          table: 'UserSessions',
          field: 'id',
        },
        fields: ['sessionId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'UserNotifications_sessionId_fkey',
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
      await queryInterface.removeConstraint('UserNotifications', 'UserNotifications_userId_fkey', {
        transaction,
      });
      await queryInterface.removeConstraint(
        'UserNotifications',
        'UserNotifications_sessionId_fkey',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
