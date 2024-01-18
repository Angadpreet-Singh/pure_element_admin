'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PromoCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      termsAndConditions: {
        allowNull: false,
        type: Sequelize.STRING
      },
      discount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      discountType: {
        allowNull: false,
        type: Sequelize.STRING
      }, //Flat OR PerCsentage
      promoCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      validFrom: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expire: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('PromoCodes');
  }
};