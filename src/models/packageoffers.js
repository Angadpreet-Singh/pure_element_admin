'use strict';
const {
  Model
} = require('sequelize');

const Packages = require("./packages");

module.exports = (sequelize, DataTypes) => {
  class PackageOffers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Packages }) {
      this.hasOne(Packages, { sourceKey: 'packageId', foreignKey: 'id', as: 'packageDetail' });
    }
  }
  PackageOffers.init({
    packageId: {
      type: DataTypes.INTEGER,
      references: {
      model: Packages, // 'Movies' would also work
      key: 'id'
    }
    },
    perMonthPrice: DataTypes.INTEGER,
    discountType: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    tenure: DataTypes.STRING,
    promoCodes: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PackageOffers',
    paranoid: true
  });

  PackageOffers.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  PackageOffers.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });

  
  return PackageOffers;
};