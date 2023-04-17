import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('UserCourses', {
        type: 'foreign key',
        references: {
          table: 'CourseSteps',
          field: 'id',
        },
        fields: ['courseStepId'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'UserCourses_courseStepId_fkey',
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
      await queryInterface.removeConstraint('UserCourses', 'UserCourses_courseStepId_fkey', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
