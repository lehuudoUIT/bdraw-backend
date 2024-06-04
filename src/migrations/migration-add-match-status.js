"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Matches", "Status", {
      type: Sequelize.BOOLEAN,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Matches", "Status");
  },
};
