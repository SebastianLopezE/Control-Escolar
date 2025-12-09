"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("grupos", [
      {
        nombre: "1ro A",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "1ro B",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "2do A",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "2do B",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("grupos", null, {});
  },
};
