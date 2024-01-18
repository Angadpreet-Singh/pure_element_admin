'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromoCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PromoCodes.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    termsAndConditions: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    discountType: DataTypes.STRING, //Flat OR PerCsentage
    promoCode: DataTypes.STRING,
    validFrom: DataTypes.DATE,
    expire: DataTypes.DATE,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, { 
    sequelize,
    modelName: 'PromoCodes',
    paranoid: true
  });

  PromoCodes.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  PromoCodes.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });

  return PromoCodes;
};