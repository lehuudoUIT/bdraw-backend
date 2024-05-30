"use strict";
const { Model } = require("sequelize");
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
      url: DataTypes.STRING,
      type: DataTypes.STRING,
      price: DataTypes.INTEGER,
      content: DataTypes.STRING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      sequelize,
      modelName: "Avatar",
    }
  );
  return Avatar;
};
