"use strict";
const { Model } = require("sequelize");
const moment = require("moment-timezone");

module.exports = (sequelize, DataTypes) => {
  class Avatar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Avatar.init(
    {
      avatarId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      url: DataTypes.STRING,
      type: DataTypes.STRING,
      price: DataTypes.INTEGER,
      content: DataTypes.STRING,
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
      modelName: "Avatar",
    }
  );
  return Avatar;
};
