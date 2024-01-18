'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transactions.init({
    transactionId: DataTypes.STRING,
    packageId: DataTypes.INTEGER,
    priceId: DataTypes.INTEGER,
    subscriptionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    tax: DataTypes.INTEGER,
    totalAmount: DataTypes.INTEGER,
    paidAmount: DataTypes.INTEGER,
    offerId: DataTypes.INTEGER,
    billingAddress: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Transactions',
    paranoid: true
  });


  Transactions.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  Transactions.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });

  return Transactions;
};