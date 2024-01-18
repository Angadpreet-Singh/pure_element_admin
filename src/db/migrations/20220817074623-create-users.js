'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
      },
      email_varified: {
        type: Sequelize.BOOLEAN
      },
      phone_number: {
        type: Sequelize.BIGINT
      },
      phone_varified: {
        type: Sequelize.BOOLEAN
      },
      user_password: {
        type: Sequelize.STRING
      },
      otp_code: {
        type: Sequelize.INTEGER
      },
      otp_expire: {
        type: Sequelize.DATE
      },
      token: {
        type: Sequelize.STRING
      },
      last_login: {
        type: Sequelize.DATE
      },
      user_role: {
        type: Sequelize.STRING,
        defaultValue: 'User'
      },
      user_type: {
        type: Sequelize.STRING,
        defaultValue: 'Customer'
      },
      user_avatar: {
        type: Sequelize.STRING,
        defaultValue: 'images/avatar/default-avatar.png'
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Active'
      },
      createdBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};