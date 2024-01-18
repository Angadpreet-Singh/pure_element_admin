'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Packages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      packageId: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      perMonthPrice: {
        type: Sequelize.INTEGER
      },
      userLimit: {
        type: Sequelize.INTEGER
      },
      resourceLimit: {
        type: Sequelize.INTEGER
      },
      customerLimit: {
        type: Sequelize.INTEGER,
      },
      installationLimit: {
        type: Sequelize.INTEGER,
      },
      rentalLimit: {
        type: Sequelize.INTEGER,
      },
      servicesLimit: {
        type: Sequelize.INTEGER,
      },
      projectLimit: {
        type: Sequelize.INTEGER
      },
      supplierLimit: {
        type: Sequelize.INTEGER
      },
      discription: {
        allowNull: true,
        type: Sequelize.STRING
      },
      support: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Packages');
  }
};