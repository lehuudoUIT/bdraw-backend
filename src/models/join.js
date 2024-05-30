"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Join extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Join.init(
    {
      joinId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      playerId: DataTypes.INTEGER,
      matchId: DataTypes.INTEGER,
      gainedBcoin: DataTypes.INTEGER,
      gainedExp: DataTypes.INTEGER,
      gainedScore: DataTypes.INTEGER,
      top: DataTypes.INTEGER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      sequelize,
      modelName: "Join",
    }
  );
  return Join;
};
