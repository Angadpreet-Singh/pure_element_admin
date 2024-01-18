"use strict";
const { Model } = require("sequelize");
import PasswordHashing from '../utlis/password-hashing'

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      user_id: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email_address: DataTypes.STRING,
      email_varified: DataTypes.BOOLEAN,
      phone_number: DataTypes.BIGINT,
      phone_varified: DataTypes.BOOLEAN,
      user_password: DataTypes.STRING,
      otp_code: DataTypes.INTEGER,
      otp_expire: DataTypes.INTEGER,
      token: DataTypes.STRING,
      last_login: DataTypes.DATE,
      user_role: DataTypes.STRING,
      user_type: DataTypes.STRING,
      user_avatar: DataTypes.STRING,
      status: DataTypes.STRING,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Users",
      paranoid: true,
    }
  );


  Users.beforeCreate(async (user, options) => {
    const hashedPassword = await PasswordHashing.hash(user.user_password);
    user.user_password = hashedPassword;
    user.createdAt = new Date();
  });

  Users.beforeUpdate(async (user, options) => {
    if (user.user_password) {
      const hashedPassword = await PasswordHashing.hash(user.user_password);
      user.user_password = hashedPassword;
    } 
    user.updatedAt = new Date();
  });

  return Users;
};
