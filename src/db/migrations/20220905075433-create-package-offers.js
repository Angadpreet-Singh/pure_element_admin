'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PackageOffers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      packageId: {
        type: Sequelize.INTEGER
      },
      perMonthPrice: {
        type: Sequelize.INTEGER
      },
      discountType: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.INTEGER
      },
      tenure: {
        type: Sequelize.INTEGER
      },
      promoCodes: {
        allowNull: true,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('PackageOffers');
  }
};