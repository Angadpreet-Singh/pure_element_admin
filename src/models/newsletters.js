'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Newsletters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Newsletters.init({
    question: DataTypes.STRING,
    email: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Newsletters',
    paranoid: true
  });


  Newsletters.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  Newsletters.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });

  return Newsletters;
};