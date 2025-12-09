const express = require("express");
const router = express.Router();
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/authMiddleware");
const maestroController = require("../controllers/maestroController");

// Ruta para obtener alumnos del maestro
router.get(
  "/alumnos",
  verificarToken,
  verificarRol(["maestro"]),
  maestroController.obtenerAlumnos
);

// Ruta para crear calificación
router.post(
  "/calificaciones",
  verificarToken,
  verificarRol(["maestro"]),
  maestroController.crearCalificacion
);

// Obtener calificaciones del maestro
router.get(
  "/calificaciones",
  verificarToken,
  verificarRol(["maestro"]),
  maestroController.obtenerCalificaciones
);

// Ruta para editar calificación
router.patch(
  "/calificaciones/:id",
  verificarToken,
  verificarRol(["maestro"]),
  maestroController.editarCalificacion
);

// Ruta para asignar curso (materia + grupo) a maestro
router.post(
  "/cursos",
  verificarToken,
  verificarRol(["maestro", "control_escolar"]),
  maestroController.asignarCurso
);

module.exports = router;
