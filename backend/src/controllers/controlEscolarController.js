const { models } = require("../models");
const { alumnos, calificaciones, materias, usuarios, grupos, cursos } = models;
const bcrypt = require("bcryptjs");

// Obtener reporte de calificaciones
exports.obtenerReporte = async (req, res) => {
  try {
    const reporte = await calificaciones.findAll({
      where: { deleted_at: null },
      include: [
        { model: alumnos, attributes: ["id", "nombre", "matricula"] },
        { model: materias, attributes: ["id", "nombre", "codigo"] },
        { model: usuarios, attributes: ["id", "nombre", "email"] },
      ],
      order: [["fecha_registro", "DESC"]],
    });

    res.json({ mensaje: "Reporte de calificaciones", datos: reporte });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener reporte", error: error.message });
  }
};

// Eliminar calificación (soft delete)
exports.eliminarCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const calificacion = await calificaciones.findByPk(id);
    if (!calificacion)
      return res.status(404).json({ mensaje: "Calificación no encontrada" });

    await calificacion.update({ deleted_at: new Date() });
    res.json({ mensaje: "Calificación eliminada", datos: calificacion });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar calificación",
      error: error.message,
    });
  }
};

// Editar calificación
exports.editarCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, observaciones } = req.body;
    const calificacion = await calificaciones.findByPk(id);
    if (!calificacion)
      return res.status(404).json({ mensaje: "Calificación no encontrada" });

    await calificacion.update({ nota, observaciones });
    res.json({ mensaje: "Calificación actualizada", datos: calificacion });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar calificación", error: error.message });
  }
};

// Crear usuario (maestro o alumno) - solo control_escolar
exports.crearUsuario = async (req, res) => {
  try {
    const { tipo } = req.body; // 'maestro' | 'alumno'

    if (tipo === "maestro") {
      const { nombre, email, password } = req.body;
      if (!nombre || !email || !password)
        return res
          .status(400)
          .json({ mensaje: "Faltan datos para crear maestro" });

      const existe = await usuarios.findOne({
        where: { email: email.toLowerCase().trim() },
      });
      if (existe)
        return res.status(400).json({ mensaje: "El email ya está registrado" });

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const nuevo = await usuarios.create({
        nombre,
        email: email.toLowerCase().trim(),
        password_hash,
        rol: "maestro",
      });
      return res.status(201).json({ mensaje: "Maestro creado", datos: nuevo });
    }

    if (tipo === "alumno") {
      const { nombre, matricula, grupo_nombre } = req.body;
      if (!nombre)
        return res
          .status(400)
          .json({ mensaje: "Faltan datos para crear alumno" });

      let grupoId = null;
      if (grupo_nombre) {
        const [grupo] = await grupos.findOrCreate({
          where: { nombre: grupo_nombre },
          defaults: { nombre: grupo_nombre },
        });
        grupoId = grupo.id;
      }

      // Preparar matrícula: usar la proporcionada o generar una aleatoria de 6 dígitos
      let matriculaFinal =
        matricula && String(matricula).trim() !== ""
          ? String(matricula).trim()
          : null;

      if (matriculaFinal) {
        const existeMat = await alumnos.findOne({
          where: { matricula: matriculaFinal },
        });
        if (existeMat)
          return res
            .status(400)
            .json({ mensaje: "La matrícula ya está registrada" });
      } else {
        // Intentar generar una matrícula única (6 dígitos). Limitar intentos para evitar loops infinitos.
        let intentos = 0;
        while (!matriculaFinal && intentos < 50) {
          const candidato = String(Math.floor(100000 + Math.random() * 900000));
          // comprobar existencia
          // eslint-disable-next-line no-await-in-loop
          const existe = await alumnos.findOne({
            where: { matricula: candidato },
          });
          if (!existe) matriculaFinal = candidato;
          intentos += 1;
        }

        if (!matriculaFinal) {
          return res
            .status(500)
            .json({
              mensaje:
                "No se pudo generar una matrícula única, intenta de nuevo",
            });
        }
      }

      const nuevoAlumno = await alumnos.create({
        nombre,
        matricula: matriculaFinal || null,
        grupo_id: grupoId,
      });
      return res
        .status(201)
        .json({ mensaje: "Alumno creado", datos: nuevoAlumno });
    }

    return res.status(400).json({ mensaje: "Tipo de usuario no válido" });
  } catch (error) {
    console.error("Error crearUsuario:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al crear usuario", error: error.message });
  }
};

// Obtener lista de maestros
exports.obtenerMaestros = async (req, res) => {
  try {
    const maestros = await usuarios.findAll({
      where: { rol: "maestro" },
      attributes: ["id", "nombre", "email"],
    });
    res.json({ mensaje: "Maestros", datos: maestros });
  } catch (error) {
    console.error("Error obtenerMaestros:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener maestros", error: error.message });
  }
};

// Asignar curso (maestro + materia + grupo)
exports.asignarCurso = async (req, res) => {
  try {
    const { maestro_id, materia_id, grupo_nombre } = req.body;
    if (!maestro_id || !materia_id || !grupo_nombre)
      return res
        .status(400)
        .json({ mensaje: "Faltan datos para asignar curso" });

    const maestro = await usuarios.findByPk(maestro_id);
    if (!maestro)
      return res.status(404).json({ mensaje: "Maestro no encontrado" });

    const materia = await materias.findByPk(materia_id);
    if (!materia)
      return res.status(404).json({ mensaje: "Materia no encontrada" });

    const [grupo] = await grupos.findOrCreate({
      where: { nombre: grupo_nombre },
      defaults: { nombre: grupo_nombre },
    });

    const nuevoCurso = await cursos.create({
      maestro_id: maestro.id,
      materia_id: materia.id,
      grupo_id: grupo.id,
    });
    res.status(201).json({ mensaje: "Curso asignado", datos: nuevoCurso });
  } catch (error) {
    console.error("Error asignarCurso:", error);
    if (error.name === "SequelizeUniqueConstraintError")
      return res.status(400).json({ mensaje: "El curso ya está asignado" });
    res
      .status(500)
      .json({ mensaje: "Error al asignar curso", error: error.message });
  }
};

// Listar alumnos
exports.listarAlumnos = async (req, res) => {
  try {
    const lista = await alumnos.findAll({
      attributes: ["id", "nombre", "matricula", "grupo_id", "created_at"],
      order: [["id", "DESC"]],
    });
    res.json({ mensaje: "Alumnos", datos: lista });
  } catch (error) {
    console.error("Error listarAlumnos:", error);
    res
      .status(500)
      .json({ mensaje: "Error al listar alumnos", error: error.message });
  }
};
