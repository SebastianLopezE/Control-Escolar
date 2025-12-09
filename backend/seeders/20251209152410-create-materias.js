"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("materias", [
      {
        codigo: "MAT",
        nombre: "Matemáticas",
        descripcion: "Materia fundamental de matemáticas",
        estatus: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        codigo: "ESP",
        nombre: "Español",
        descripcion: "Materia de lenguaje y comunicación",
        estatus: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("materias", null, {});
  },
};
