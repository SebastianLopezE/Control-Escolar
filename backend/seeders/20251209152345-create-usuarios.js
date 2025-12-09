"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("usuarios", [
      {
        nombre: "Admin ",
        email: "admin@gmail.com",
        password_hash: await bcrypt.hash("123456", 10),
        rol: "control_escolar",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Pedro García",
        email: "pedroa@gmail.com",
        password_hash: await bcrypt.hash("123456", 10),
        rol: "maestro",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Juan López",
        email: "juan@gmail.com",
        password_hash: await bcrypt.hash("123456", 10),
        rol: "maestro",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuarios", null, {});
  },
};
