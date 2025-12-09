const sequelize = require("../config/database");
console.log("Inicializando modelos...");
const initModels = require("./init-models");

const models = initModels(sequelize);
module.exports = { sequelize, models };
