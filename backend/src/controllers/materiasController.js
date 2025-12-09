const { models } = require("../models");
const { materias } = models;

// Listar materias
exports.listar = async (_req, res) => {
  try {
    const lista = await materias.findAll({
      attributes: ["id", "nombre", "codigo", "descripcion"],
      order: [["nombre", "ASC"]],
    });
    res.json({ mensaje: "Materias", datos: lista });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener materias", error: error.message });
  }
};
