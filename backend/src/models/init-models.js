var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _alumnos = require("./alumnos");
var _calificaciones = require("./calificaciones");
var _cursos = require("./cursos");
var _grupos = require("./grupos");
var _materias = require("./materias");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var alumnos = _alumnos(sequelize, DataTypes);
  var calificaciones = _calificaciones(sequelize, DataTypes);
  var cursos = _cursos(sequelize, DataTypes);
  var grupos = _grupos(sequelize, DataTypes);
  var materias = _materias(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  calificaciones.belongsTo(alumnos, { as: "alumno", foreignKey: "alumno_id"});
  alumnos.hasMany(calificaciones, { as: "calificaciones", foreignKey: "alumno_id"});
  alumnos.belongsTo(grupos, { as: "grupo", foreignKey: "grupo_id"});
  grupos.hasMany(alumnos, { as: "alumnos", foreignKey: "grupo_id"});
  cursos.belongsTo(grupos, { as: "grupo", foreignKey: "grupo_id"});
  grupos.hasMany(cursos, { as: "cursos", foreignKey: "grupo_id"});
  calificaciones.belongsTo(materias, { as: "materium", foreignKey: "materia_id"});
  materias.hasMany(calificaciones, { as: "calificaciones", foreignKey: "materia_id"});
  cursos.belongsTo(materias, { as: "materium", foreignKey: "materia_id"});
  materias.hasMany(cursos, { as: "cursos", foreignKey: "materia_id"});
  calificaciones.belongsTo(usuarios, { as: "maestro", foreignKey: "maestro_id"});
  usuarios.hasMany(calificaciones, { as: "calificaciones", foreignKey: "maestro_id"});
  cursos.belongsTo(usuarios, { as: "maestro", foreignKey: "maestro_id"});
  usuarios.hasMany(cursos, { as: "cursos", foreignKey: "maestro_id"});

  return {
    SequelizeMeta,
    alumnos,
    calificaciones,
    cursos,
    grupos,
    materias,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
