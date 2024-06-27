"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Joins", {
      joinId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      playerId: {
        type: Sequelize.INTEGER,
      },
      matchId: {
        type: Sequelize.STRING,
      },
      gainedBcoin: {
        type: Sequelize.INTEGER,
      },
      gainedExp: {
        type: Sequelize.INTEGER,
      },
      gainedScore: {
        type: Sequelize.INTEGER,
      },
      top: {
        type: Sequelize.INTEGER,
      },
      isAFK: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Joins");
  },
};
