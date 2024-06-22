"use strict";
const { Model } = require("sequelize");
import moment from "moment-timezone";

console.log(
  moment.tz(new Date(), "Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss")
);

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Player.init(
    {
      playerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      bcoin: DataTypes.INTEGER,
      rankId: DataTypes.INTEGER,
      currentAvatar: DataTypes.STRING,
      exp: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      gmail: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: () =>
          moment.tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: () =>
          moment.tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss"),
      },
    },
    {
      sequelize,
      modelName: "Player",
    }
  );
  return Player;
};
