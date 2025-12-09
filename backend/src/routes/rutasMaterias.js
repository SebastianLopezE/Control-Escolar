const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/materiasController");

// Público: listar materias
router.get("/", materiasController.listar);

module.exports = router;
