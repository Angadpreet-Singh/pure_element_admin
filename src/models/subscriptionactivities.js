'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionActivities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubscriptionActivities.init({

    subDomain: DataTypes.STRING,
    message: DataTypes.STRING,
    activityStatus:DataTypes.STRING,
    errorMessage:DataTypes.STRING,
    apiLevel:DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'SubscriptionActivities',
    paranoid: true
  });

  SubscriptionActivities.beforeCreate(async (data, options) => {
    data.createdAt = new Date();
  });

  SubscriptionActivities.beforeUpdate(async (data, options) => {
      data.updatedAt = new Date();
  });
  return SubscriptionActivities;
};