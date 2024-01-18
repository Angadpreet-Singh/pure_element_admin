"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Packages, Users, PackageOffers }) {
      // define association here
      this.hasOne(Packages, {
        foreignKey: "id",
        sourceKey: "packageId",
        as: "packageDetail",
      });
      this.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "userId",
        as: "userDetail",
      });
      this.hasOne(PackageOffers, {
        foreignKey: "id",
        sourceKey: "priceId",
        as: "priceDetail",
      });
      this.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "userId",
        as: "user",
      });
    }
  }
  Subscriptions.init(
    {
      subscriptionId: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      packageId: DataTypes.INTEGER,
      priceId: DataTypes.INTEGER,
      userLimit: DataTypes.INTEGER,
      resourceLimit: DataTypes.INTEGER,
      customerLimit: DataTypes.INTEGER,
      installationLimit: DataTypes.INTEGER,
      rentalLimit: DataTypes.INTEGER,
      servicesLimit: DataTypes.INTEGER,
      support: DataTypes.STRING,
      purchaseDate: DataTypes.DATE,
      expireDate: DataTypes.DATE,
      orderStatus: DataTypes.STRING,
      subDomain: DataTypes.STRING,
      domain: DataTypes.STRING,
      apiPort: DataTypes.INTEGER,
      databaseName: DataTypes.STRING,
      companayName: DataTypes.STRING,
      logo: DataTypes.STRING,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Subscriptions",
      paranoid: true,
    }
  );

  Subscriptions.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  Subscriptions.beforeUpdate(async (data, options) => {
    data.updatedAt = new Date();
  });
  return Subscriptions;
};
