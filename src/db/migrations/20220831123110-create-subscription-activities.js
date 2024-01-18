'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SubscriptionActivities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subDomain: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      errorMessage: {
        allowNull: true,
        type: Sequelize.STRING(5000)
      },
      activityStatus: {
        type: Sequelize.STRING
      },
      apiLevel: {
        type: Sequelize.INTEGER
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.STRING
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      status: {
        defaultValue: 'Active',
        type: Sequelize.STRING
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SubscriptionActivities');
  }
};