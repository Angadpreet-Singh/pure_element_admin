"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subscriptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subscriptionId: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      packageId: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      priceId: {
        type: Sequelize.INTEGER,
      },
      userLimit: {
        type: Sequelize.INTEGER,
      },
      resourceLimit: {
        type: Sequelize.INTEGER,
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
      support: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      purchaseDate: {
        type: Sequelize.DATE,
      },
      expireDate: {
        type: Sequelize.DATE,
      },
      orderStatus: {
        defaultValue: "pending",
        type: Sequelize.STRING,
      },
      subDomain: {
        type: Sequelize.STRING,
      },
      domain: {
        type: Sequelize.STRING,
      },
      apiPort: {
        type: Sequelize.INTEGER,
      },
      databaseName: {
        type: Sequelize.STRING,
      },
      companayName: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      status: {
        defaultValue: "Active",
        type: Sequelize.STRING,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Subscriptions");
  },
};
