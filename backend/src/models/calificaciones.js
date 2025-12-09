const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('calificaciones', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alumnos',
        key: 'id'
      },
      unique: "calificaciones_alumno_id_materia_id_maestro_id_key"
    },
    materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias',
        key: 'id'
      },
      unique: "calificaciones_alumno_id_materia_id_maestro_id_key"
    },
    maestro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      unique: "calificaciones_alumno_id_materia_id_maestro_id_key"
    },
    nota: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'calificaciones',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "calificaciones_alumno_id_materia_id_maestro_id_key",
        unique: true,
        fields: [
          { name: "alumno_id" },
          { name: "materia_id" },
          { name: "maestro_id" },
        ]
      },
      {
        name: "calificaciones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
