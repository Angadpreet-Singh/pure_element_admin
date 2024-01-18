'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faqs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Faqs.init({
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Faqs',
    paranoid: true
  });


  Faqs.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  Faqs.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });

  return Faqs;
};