"use strict";
const { Model } = require("sequelize");
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
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      bcoin: DataTypes.INTEGER,
      rankId: DataTypes.INTEGER,
      currentAvatar: DataTypes.STRING,
      exp: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      gmail: DataTypes.STRING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      sequelize,
      modelName: "Player",
    }
  );
  return Player;
};
