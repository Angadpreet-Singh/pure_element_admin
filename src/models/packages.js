'use strict';
const {
  Model
} = require('sequelize');

const { PackageOffers } = require('./index');

module.exports = (sequelize, DataTypes) => {
  class Packages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PackageOffers, PackageServices }) {
      this.hasMany(PackageOffers, { as: 'prices', foreignKey : 'packageId'});
      this.hasMany(PackageServices, { as: 'services', foreignKey : 'packageId'});
    }
  }
  Packages.init({
    packageId: DataTypes.STRING,
    title: DataTypes.STRING,
    icon: DataTypes.STRING,
    perMonthPrice: DataTypes.INTEGER,
    userLimit: DataTypes.STRING,
    resourceLimit: DataTypes.INTEGER,
    customerLimit: DataTypes.INTEGER,
    installationLimit: DataTypes.INTEGER,
    rentalLimit: DataTypes.INTEGER,
    servicesLimit: DataTypes.INTEGER,
    projectLimit: DataTypes.STRING,
    supplierLimit: DataTypes.STRING,
    support: DataTypes.BOOLEAN,
    discription: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Packages',
    paranoid: true
  });

  Packages.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  Packages.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });

  return Packages;
};