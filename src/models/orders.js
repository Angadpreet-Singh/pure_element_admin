'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Packages }) {
      this.hasOne(Packages, {
        foreignKey: "id",
        sourceKey: "packageId",
        as: "packageDetail",
      });
      this.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "customerId",
        as: "userDetail",
      });
    }  
  }
  Orders.init({
    orderId: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    packageId: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    couponId: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    transactionId: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Orders',
    paranoid: true
  });
  return Orders;
};