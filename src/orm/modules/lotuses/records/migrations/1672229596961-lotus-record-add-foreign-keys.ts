import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('LotusRecords', {
        type: 'foreign key',
        references: {
          table: 'Users',
          field: 'id',
        },
        fields: ['userId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'LotusRecords_userId_fkey',
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
      await queryInterface.removeConstraint('LotusRecords', 'LotusRecords_userId_fkey', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
