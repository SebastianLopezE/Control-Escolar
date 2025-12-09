const express = require("express");
const router = express.Router();
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/authMiddleware");
const controlEscolarController = require("../controllers/controlEscolarController");

// Ruta para obtener reporte de calificaciones
router.get(
  "/reporte",
  verificarToken,
  verificarRol(["control_escolar"]),
  controlEscolarController.obtenerReporte
);

// Ruta para eliminar calificación (soft delete)
router.delete(
  "/calificaciones/:id",
  verificarToken,
  verificarRol(["control_escolar"]),
  controlEscolarController.eliminarCalificacion
);

// Ruta para editar calificación
router.patch(
  "/calificaciones/:id",
  verificarToken,
  verificarRol(["control_escolar"]),
  controlEscolarController.editarCalificacion
);

// Crear usuario (maestro o alumno)
router.post(
  "/usuarios",
  verificarToken,
  verificarRol(["control_escolar"]),
  controlEscolarController.crearUsuario
);

// Obtener maestros
router.get(
  "/maestros",
  verificarToken,
  verificarRol(["control_escolar"]),
  controlEscolarController.obtenerMaestros
);

// Listar alumnos (control escolar)
router.get(
  "/alumnos",
  verificarToken,
  verificarRol(["control_escolar"]),
  controlEscolarController.listarAlumnos
);

// Asignar curso a maestro (maestro + materia + grupo)
router.post(
  "/asignar-curso",
  verificarToken,
  verificarRol(["control_escolar"]),
  controlEscolarController.asignarCurso
);

module.exports = router;
