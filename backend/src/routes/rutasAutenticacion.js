const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/authMiddleware");

// Ruta para Registro de Usuarios
// Solo usuarios autenticados con rol 'control_escolar' pueden crear maestros/alumnos
router.post(
  "/registro",
  verificarToken,
  verificarRol(["control_escolar"]),
  authController.registrar
);

// ruta para Iniciar Sesión
router.post("/login", authController.iniciarSesion);

// // Ruta para Cerrar Sesión
// router.get("/logout", authController.cerrarSesion);

module.exports = router;
