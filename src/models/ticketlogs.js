'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TicketLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users,Tickets}) {
      this.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "userId",
        as: "userDetail",
      });
      this.hasOne(Tickets, {
        foreignKey: "ticketId",
        sourceKey: "ticketId",
        as: "ticketDetail",
      });
    }
  }
  TicketLogs.init({
    ticketId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TicketLogs',
    paranoid: true
  });
  return TicketLogs;
};