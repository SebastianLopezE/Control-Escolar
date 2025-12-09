const { models } = require("../models");
const { alumnos, calificaciones, materias, cursos, usuarios, grupos } = models;

exports.obtenerAlumnos = async (req, res) => {
  try {
    const maestro_id = req.usuario.id;

    // obtener cursos
    const asignaciones = await cursos.findAll({
      where: { maestro_id },
      include: [
        { model: grupos, as: "grupo", attributes: ["id", "nombre"] },
        {
          model: materias,
          as: "materium",
          attributes: ["id", "nombre", "codigo"],
        },
      ],
    });

    if (!asignaciones.length)
      return res.json({ mensaje: "Sin cursos", datos: [] });

    // mapear cursos por grupo_id
    const mapaCursos = new Map();
    asignaciones.forEach((curso) => {
      mapaCursos.set(curso.grupo_id, curso);
    });

    // obtener ids de grupos
    const grupoIds = asignaciones.map((c) => c.grupo_id);

    // obtener alumnos
    const alumnosAsignados = await alumnos.findAll({
      where: { grupo_id: grupoIds },
      include: [{ model: grupos, as: "grupo", attributes: ["nombre"] }],
      order: [["nombre", "ASC"]],
    });

    // mapear alumnos con su materia
    const alumnosFormateados = alumnosAsignados.map((alumno) => {
      const cursoCorrespondiente = mapaCursos.get(alumno.grupo_id);

      return {
        id: alumno.id,
        nombre: alumno.nombre,
        matricula: alumno.matricula || "Sin matrícula",
        grupo: alumno.grupo?.nombre || "Sin grupo",
        // Aquí extraemos la materia del curso encontrado
        materia:
          cursoCorrespondiente?.materium?.nombre || "Sin materia asignada",
        materia_id: cursoCorrespondiente?.materium?.id || null,
        curso_id: cursoCorrespondiente?.id || null,
      };
    });

    res.json({ mensaje: "Éxito", datos: alumnosFormateados });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error", error: error.message });
  }
};

// Crear calificación
exports.crearCalificacion = async (req, res) => {
  try {
    const { alumno_id, materia_id, nota, observaciones } = req.body;
    const maestro_id = req.usuario.id;

    // Validar que exista el alumno
    const alumnoExiste = await alumnos.findByPk(alumno_id);
    if (!alumnoExiste) {
      return res.status(404).json({ mensaje: "Alumno no encontrado" });
    }

    // Validar que exista la materia (si se proporciona)
    if (materia_id) {
      const materiaExiste = await materias.findByPk(materia_id);
      if (!materiaExiste) {
        return res.status(404).json({ mensaje: "Materia no encontrada" });
      }
    }

    // Validar que nota sea un número válido
    if (nota === undefined || nota === null) {
      return res.status(400).json({ mensaje: "La nota es requerida" });
    }

    // Buscar si ya existe una calificación para este alumno, materia y maestro
    // Primero buscamos incluido soft-deleted (paranoid: false) para poder restaurar si fue eliminado
    let calificacionExistente;
    if (materia_id) {
      calificacionExistente = await calificaciones.findOne({
        where: {
          alumno_id,
          materia_id,
          maestro_id,
        },
        paranoid: false, // Incluir registros eliminados
      });
    } else {
      // Si materia_id es null, buscar explícitamente
      calificacionExistente = await calificaciones.findOne({
        where: {
          alumno_id,
          materia_id: null,
          maestro_id,
        },
        paranoid: false, // Incluir registros eliminados
      });
    }

    let resultado;
    if (calificacionExistente) {
      // Si la calificación fue eliminada (soft-delete), restaurarla primero
      if (calificacionExistente.deletedAt) {
        await calificacionExistente.restore();
      }
      // Actualizar calificación existente
      resultado = await calificacionExistente.update({
        nota: Number(nota),
        observaciones: observaciones || null,
      });
    } else {
      // Crear nueva calificación
      resultado = await calificaciones.create({
        alumno_id,
        materia_id: materia_id || null,
        maestro_id,
        nota: Number(nota),
        observaciones: observaciones || null,
        fecha_registro: new Date(),
      });
    }

    res.status(201).json({
      mensaje: "Calificación registrada",
      datos: resultado,
    });
  } catch (error) {
    console.error("Error en crearCalificacion:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear calificación", error: error.message });
  }
};

// Obtener calificaciones del maestro con detalles (alumno, grupo, materia)
exports.obtenerCalificaciones = async (req, res) => {
  try {
    const maestro_id = req.usuario.id;

    const lista = await calificaciones.findAll({
      where: { maestro_id },
      include: [
        {
          model: alumnos,
          as: "alumno",
          attributes: ["id", "nombre", "matricula", "grupo_id"],
          include: [
            { model: grupos, as: "grupo", attributes: ["id", "nombre"] },
          ],
        },
        {
          model: materias,
          as: "materium",
          attributes: ["id", "nombre", "codigo"],
        },
      ],
      order: [["fecha_registro", "DESC"]],
    });

    // Formatear resultado para frontend
    const datos = lista.map((c) => ({
      id: c.id,
      alumno_id: c.alumno_id,
      alumno_nombre: c.alumno?.nombre || null,
      alumno_matricula: c.alumno?.matricula || null,
      grupo: c.alumno?.grupo?.nombre || null,
      materia_id: c.materia_id,
      materia_nombre: c.materium?.nombre || null,
      nota: c.nota,
      observaciones: c.observaciones,
      fecha_registro: c.fecha_registro,
    }));

    res.json({ mensaje: "Calificaciones maestro", datos });
  } catch (error) {
    console.error("Error obtenerCalificaciones:", error);
    res.status(500).json({
      mensaje: "Error al obtener calificaciones",
      error: error.message,
    });
  }
};

// Editar calificación
exports.editarCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, observaciones } = req.body;
    const maestro_id = req.usuario.id;

    // Obtener calificación
    const calificacion = await calificaciones.findByPk(id);
    if (!calificacion) {
      return res.status(404).json({ mensaje: "Calificación no encontrada" });
    }

    // Validar que el maestro sea el propietario
    if (calificacion.maestro_id !== maestro_id) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para editar esta calificación" });
    }

    // Actualizar
    await calificacion.update({ nota, observaciones });

    res.json({ mensaje: "Calificación actualizada", datos: calificacion });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar calificación", error: error.message });
  }
};

// Asignar curso (materia + grupo) a un maestro
exports.asignarCurso = async (req, res) => {
  try {
    const { maestro_id, materia_id, grupo_nombre } = req.body;

    // Validar maestro
    const maestro = await usuarios.findByPk(maestro_id);
    if (!maestro || maestro.rol.toLowerCase() !== "maestro") {
      return res.status(400).json({ mensaje: "Maestro inválido" });
    }

    // Validar materia
    const materia = await materias.findByPk(materia_id);
    if (!materia) {
      return res.status(400).json({ mensaje: "Materia inválida" });
    }

    // Buscar o crear grupo por nombre
    const [grupo, creado] = await grupos.findOrCreate({
      where: { nombre: grupo_nombre },
      defaults: { nombre: grupo_nombre },
    });

    // Crear asignación (única por maestro+materia+grupo)
    const curso = await cursos.create({
      maestro_id,
      materia_id,
      grupo_id: grupo.id,
    });

    res.status(201).json({ mensaje: "Curso asignado", datos: curso });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ mensaje: "Ya existe esa asignación" });
    }
    res
      .status(500)
      .json({ mensaje: "Error al asignar curso", error: error.message });
  }
};
