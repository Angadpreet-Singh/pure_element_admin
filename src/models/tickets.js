'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users}) {
      this.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "customerId",
        as: "userDetail",
      });
    }
  }
  Tickets.init({
    title: DataTypes.STRING,
    ticketId: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    ticketStatus: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tickets',
    paranoid: true
  });
  return Tickets;
};