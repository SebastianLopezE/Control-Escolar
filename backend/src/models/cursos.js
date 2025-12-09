const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cursos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    maestro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      unique: "cursos_maestro_id_materia_id_grupo_id_key"
    },
    materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias',
        key: 'id'
      },
      unique: "cursos_maestro_id_materia_id_grupo_id_key"
    },
    grupo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grupos',
        key: 'id'
      },
      unique: "cursos_maestro_id_materia_id_grupo_id_key"
    }
  }, {
    sequelize,
    tableName: 'cursos',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "cursos_maestro_id_materia_id_grupo_id_key",
        unique: true,
        fields: [
          { name: "maestro_id" },
          { name: "materia_id" },
          { name: "grupo_id" },
        ]
      },
      {
        name: "cursos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
