"use strict";
const { Model } = require("sequelize");
import moment from "moment-timezone";

module.exports = (sequelize, DataTypes) => {
  class Player_Avatar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Player_Avatar.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      playerId: DataTypes.INTEGER,
      avatarId: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: () =>
          moment.tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss"),
      },
    },
    {
      sequelize,
      modelName: "Player_Avatar",
      freezeTableName: true,
    }
  );
  return Player_Avatar;
};
