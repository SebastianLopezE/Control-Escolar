"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const initModels = require("./init-models");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/config.json")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Inicializar modelos con asociaciones
const models = initModels(sequelize);

const db = {
  sequelize,
  Sequelize,
  ...models,
};

module.exports = db;
module.exports.models = models;
