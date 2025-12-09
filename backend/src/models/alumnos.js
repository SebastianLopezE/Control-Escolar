const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "alumnos",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      matricula: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: "alumnos_matricula_key",
      },
      grupo_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "grupos",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "alumnos",
      schema: "public",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: "alumnos_matricula_key",
          unique: true,
          fields: [{ name: "matricula" }],
        },
        {
          name: "alumnos_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
