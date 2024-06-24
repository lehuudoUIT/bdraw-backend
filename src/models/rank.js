"use strict";
const { Model } = require("sequelize");
import moment from "moment-timezone";

module.exports = (sequelize, DataTypes) => {
    class Rank extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Rank.init(
        {
            rankId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            scoreMilestone: DataTypes.INTEGER,
            url: DataTypes.STRING,
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
            modelName: "Rank",
        }
    );
    return Rank;
};
