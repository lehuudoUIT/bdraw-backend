"use strict";
const { Model } = require("sequelize");
import moment from "moment-timezone";

module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Match.init(
    {
      matchId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: () =>
          moment.tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss"),
      },
    },
    {
      sequelize,
      modelName: "Match",
    }
  );
  return Match;
};
