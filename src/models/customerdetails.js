'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomerDetails.init({
    userId: DataTypes.INTEGER,
    organizationName: DataTypes.STRING,
    regNo: DataTypes.STRING,  //Orgnization Reg No.
    primaryAddressID: DataTypes.INTEGER,
    phoneNumber: DataTypes.INTEGER,
    emailAddress: DataTypes.STRING,
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    country: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CustomerDetails',
    paranoid: true
  });

  CustomerDetails.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  CustomerDetails.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });

  return CustomerDetails;
};