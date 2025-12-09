const express = require("express");
const router = express.Router();
const gruposController = require("../controllers/gruposController");

// Público: listar grupos
router.get("/", gruposController.listar);

module.exports = router;
