const { models } = require("../models");
const { grupos } = models;

// Listar grupos
exports.listar = async (_req, res) => {
  try {
    const lista = await grupos.findAll({
      attributes: ["id", "nombre"],
      order: [["nombre", "ASC"]],
    });
    res.json({ mensaje: "Grupos", datos: lista });
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener grupos", error: error.message });
  }
};
