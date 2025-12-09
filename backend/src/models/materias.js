const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "materias",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      codigo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: "materias_codigo_key",
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "materias",
      schema: "public",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: "materias_codigo_key",
          unique: true,
          fields: [{ name: "codigo" }],
        },
        {
          name: "materias_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
