"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("alumnos", [
      {
        nombre: "Carlos Mendoza",
        matricula: "123845",
        grupo_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Maria Gonzalez",
        matricula: "845935",
        grupo_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Juan Perez",
        matricula: "852654",
        grupo_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Ana Lopez",
        matricula: "951753",
        grupo_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Luis Rodriguez",
        matricula: "987321",
        grupo_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Sofia Martinez",
        matricula: "123456",
        grupo_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "David Hernandez",
        matricula: "123852",
        grupo_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Elena Sanchez",
        matricula: "973176",
        grupo_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("alumnos", null, {});
  },
};
