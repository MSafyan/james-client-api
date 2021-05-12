"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "ChatMessages",
      "reactions",
      Sequelize.STRING
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ChatMessages");
  },
};
