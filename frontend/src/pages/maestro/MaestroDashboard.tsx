import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import { Botón } from "../../components/common/Botón";
import api from "../../services/api";

interface Alumno {
  id: number;
  nombre: string;
  matricula: string;
  grupo: string;
  materia?: string;
  materia_codigo?: string;
  curso_id?: number;
  materia_id?: number | null;
}

export function MaestroDashboard() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAutenticacion();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cursos, setCursos] = useState<
    {
      curso_id: number | null;
      materia: string;
      materia_codigo?: string;
      grupo: string;
    }[]
  >([]);
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [notas, setNotas] = useState<Record<number, string>>({});
  const [observaciones, setObservaciones] = useState<Record<number, string>>(
    {}
  );
  const [alumnoEnEdicion, setAlumnoEnEdicion] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [vistaActual, setVistaActual] = useState<
    "dashboard" | "alumnos" | "calificaciones" | "editarCalificaciones"
  >("dashboard");
  const [calificacionesList, setCalificacionesList] = useState<
    Array<{
      id: number;
      alumno_nombre: string;
      alumno_matricula: string | null;
      grupo: string | null;
      materia_nombre: string | null;
      nota: number | null;
      observaciones: string | null;
    }>
  >([]);
  const [editableMap, setEditableMap] = useState<Record<number, boolean>>({});
  const [originalCalificaciones, setOriginalCalificaciones] = useState<
    Record<string, any>
  >({});

  useEffect(() => {
    if (vistaActual === "alumnos") {
      obtenerAlumnos();
    }
    if (vistaActual === "calificaciones") {
      // cargar alumnos y cursos asignados al maestro
      cargarCursosYAlumnos();
    }
    if (vistaActual === "editarCalificaciones") {
      cargarCalificaciones();
    }
  }, [vistaActual]);

  const cargarCalificaciones = async () => {
    try {
      setCargando(true);
      const resp = await api.get("/maestro/calificaciones");
      const datos = resp.data.datos || [];
      // normalizar tipos
      const listaNormalizada = datos.map((d: any) => ({
        id: d.id,
        alumno_nombre: d.alumno_nombre || "-",
        alumno_matricula: d.alumno_matricula || null,
        grupo: d.grupo || null,
        materia_nombre: d.materia_nombre || null,
        nota: d.nota !== undefined && d.nota !== null ? Number(d.nota) : null,
        observaciones: d.observaciones || null,
      }));

      setCalificacionesList(listaNormalizada);
      // Guardar snapshot para poder cancelar cambios por fila
      const snap: Record<string, any> = {};
      listaNormalizada.forEach((item: any) => {
        snap[String(item.id)] = { ...item };
      });
      setOriginalCalificaciones(snap);
      setEditableMap({});
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
      setCalificacionesList([]);
    } finally {
      setCargando(false);
    }
  };

  const cargarCursosYAlumnos = async () => {
    try {
      setCargando(true);
      const respuesta = await api.get("/maestro/alumnos");
      const datos = respuesta.data.datos || [];
      setAlumnos(datos);

      // construir lista de cursos únicos a partir de los alumnos (cada alumno tiene curso_id, materia, grupo)
      const mapa = new Map();
      datos.forEach((a: any) => {
        const key = a.curso_id || `${a.materia}_${a.grupo}`;
        if (!mapa.has(key)) {
          mapa.set(key, {
            curso_id: a.curso_id,
            materia: a.materia || "Sin materia",
            materia_codigo: a.materia_codigo || "",
            grupo: a.grupo || "",
          });
        }
      });

      setCursos(Array.from(mapa.values()));
      // seleccionar el primero por defecto
      const primera = Array.from(mapa.values())[0];
      setSelectedCursoId(primera ? primera.curso_id || null : null);
    } catch (error) {
      console.error("Error al cargar cursos y alumnos:", error);
      setAlumnos([]);
      setCursos([]);
    } finally {
      setCargando(false);
    }
  };

  const obtenerAlumnos = async () => {
    try {
      setCargando(true);
      const respuesta = await api.get("/maestro/alumnos");
      setAlumnos(respuesta.data.datos || []);
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
      setAlumnos([]);
    } finally {
      setCargando(false);
    }
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate("/iniciar-sesion");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="encabezado">
        <div className="contenido-encabezado flex justify-between items-center">
          <h2 className="text-white text-2xl font-bold">
            ¡Hola, Maestro {usuario?.nombre}!
          </h2>
          <div className="space-x-4">
            <span className="text-white">{usuario?.nombre || "Maestro"}</span>
            <Botón variante="secondary" onClick={manejarCerrarSesion}>
              Cerrar Sesión
            </Botón>
          </div>
        </div>
      </div>

      <div className="contenedor-panel p-8 max-w-5xl mx-auto">
        {vistaActual === "dashboard" && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Bienvenido, {usuario?.nombre}!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              <strong>Panel de Maestro</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
              <div
                onClick={() => setVistaActual("calificaciones")}
                className="w-full bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  Registrar Calificaciones
                </h3>
                <p className="text-gray-600">
                  Captura las calificaciones de tus alumnos
                </p>
              </div>

              <div
                onClick={() => setVistaActual("editarCalificaciones")}
                className="w-full bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  Editar Calificaciones
                </h3>
                <p className="text-gray-600">
                  Edita las calificaciones de tus alumnos
                </p>
              </div>

              <div
                onClick={() => setVistaActual("alumnos")}
                className="w-full bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-green-600 mb-3">
                  Mis Alumnos
                </h3>
                <p className="text-gray-600">
                  Consulta la lista de alumnos asignados
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Vista de Alumnos */}
        {vistaActual === "alumnos" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Mis Alumnos</h2>
              <Botón
                variante="secondary"
                onClick={() => setVistaActual("dashboard")}
              >
                Volver al inicio
              </Botón>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
             // tabla de alumnos 
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matrícula
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Materia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cargando ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Cargando alumnos...
                      </td>
                    </tr>
                  ) : alumnos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No hay alumnos asignados
                      </td>
                    </tr>
                  ) : ( 
                    alumnos.map((alumno) => (
                      <tr key={alumno.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {alumno.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {alumno.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alumno.matricula}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alumno.materia || "Sin materia"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alumno.grupo}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vista de Registrar Calificaciones */}
        {vistaActual === "calificaciones" && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Registrar Calificaciones
              </h2>
              <Botón
                variante="secondary"
                onClick={() => setVistaActual("dashboard")}
              >
                Volver al inicio
              </Botón>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              {/*datos generales (Materia y Grupo) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b pb-6 border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1 ">
                    Selecciona Curso
                  </label>
                  <select
                    value={selectedCursoId ?? ""}
                    onChange={(e) =>
                      setSelectedCursoId(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded text-base font-sans bg-white focus:outline-none focus:border-blue-600"
                  >
                    {cursos.length === 0 && (
                      <option value="">No hay cursos asignados</option>
                    )}
                    {cursos.map((c, idx) => (
                      <option key={idx} value={c.curso_id ?? ""}>
                        {c.materia} — {c.grupo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Materia
                  </label>
                  <div className="text-lg font-bold text-gray-800">
                    {cursos.find(
                      (c) => (c.curso_id ?? null) === selectedCursoId
                    )?.materia ?? "-"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Grupo
                  </label>
                  <div className="text-lg font-bold text-gray-800">
                    {cursos.find(
                      (c) => (c.curso_id ?? null) === selectedCursoId
                    )?.grupo ?? "-"}
                  </div>
                </div>
              </div>

              {/* --- SECCIÓN 2: LISTA DE ALUMNOS (Tabla) --- */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nombre del Alumno
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Matrícula
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Calificación
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Ejemplo de datos estáticos (puedes mapear tu array de alumnos aquí) */}
                    {alumnos
                      .filter((a) => (a.curso_id || null) === selectedCursoId)
                      .map((alumno) => {
                        const hayAlumnoEnEdicion =
                          alumnoEnEdicion !== null &&
                          alumnoEnEdicion !== alumno.id;
                        const inputDeshabilitado = hayAlumnoEnEdicion;

                        return (
                          <tr
                            key={alumno.id}
                            className={
                              inputDeshabilitado ? "opacity-50" : "opacity-100"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {alumno.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {alumno.matricula}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                disabled={inputDeshabilitado}
                                value={notas[alumno.id] ?? ""}
                                onFocus={() =>
                                  !inputDeshabilitado &&
                                  setAlumnoEnEdicion(alumno.id)
                                }
                                onChange={(e) =>
                                  !inputDeshabilitado &&
                                  setNotas((s) => ({
                                    ...s,
                                    [alumno.id]: e.target.value,
                                  }))
                                }
                                className={`border border-gray-300 rounded px-3 py-1 w-20 focus:outline-none ${
                                  inputDeshabilitado
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "focus:ring-2 focus:ring-blue-500"
                                }`}
                                placeholder="0.0"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <input
                                type="text"
                                disabled={inputDeshabilitado}
                                value={observaciones[alumno.id] ?? ""}
                                onFocus={() =>
                                  !inputDeshabilitado &&
                                  setAlumnoEnEdicion(alumno.id)
                                }
                                onChange={(e) =>
                                  !inputDeshabilitado &&
                                  setObservaciones((s) => ({
                                    ...s,
                                    [alumno.id]: e.target.value,
                                  }))
                                }
                                className={`border border-gray-300 rounded px-3 py-1 w-full focus:outline-none ${
                                  inputDeshabilitado
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "focus:ring-2 focus:ring-blue-500"
                                }`}
                                placeholder="Observaciones (opcional)"
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Botón de Guardar al final */}
              <div className="mt-6 flex justify-end gap-2">
                <Botón
                  variante="primary"
                  estaCargando={guardando}
                  disabled={guardando}
                  onClick={async () => {
                    try {
                      setGuardando(true);
                      const alumnosAEnviar = alumnos.filter(
                        (a) => (a.curso_id || null) === selectedCursoId
                      );

                      if (alumnosAEnviar.length === 0) {
                        alert("No hay alumnos en este curso");
                        return;
                      }

                      if (
                        !alumnosAEnviar[0].materia_id ||
                        alumnosAEnviar[0].materia_id === null
                      ) {
                        alert("Error: No se encontró la materia del curso");
                        return;
                      }

                      // Recolectar todas las calificaciones a guardar
                      const calificacionesAGuardar = alumnosAEnviar
                        .filter((alumno) => {
                          const nota = notas[alumno.id];
                          return nota !== undefined && nota !== "";
                        })
                        .map((alumno) => ({
                          alumno_id: alumno.id,
                          materia_id: alumno.materia_id,
                          nota: Number(notas[alumno.id]),
                          observaciones: observaciones[alumno.id] || null,
                        }));

                      if (calificacionesAGuardar.length === 0) {
                        alert("No se ingresó ninguna calificación");
                        return;
                      }

                      // Guardar todas las calificaciones secuencialmente (una por una)
                      const resultados = [];
                      for (const cal of calificacionesAGuardar) {
                        try {
                          const response = await api.post(
                            "/maestro/calificaciones",
                            cal
                          );
                          resultados.push({
                            status: "fulfilled",
                            value: response,
                          });
                        } catch (err) {
                          resultados.push({
                            status: "rejected",
                            reason: err,
                          });
                        }
                      }

                      // Contar éxitos y errores
                      const exitosas = resultados.filter(
                        (r) => r.status === "fulfilled"
                      ).length;
                      const errores = resultados.filter(
                        (r) => r.status === "rejected"
                      );

                      if (errores.length > 0) {
                        console.error(
                          "Errores al guardar calificaciones:",
                          errores
                        );
                        alert(
                          `${exitosas} calificación(es) guardada(s) correctamente.\n${errores.length} error(es) durante el guardado. Revisa la consola para detalles.`
                        );
                      } else {
                        alert(
                          `¡Éxito! ${exitosas} calificación(es) guardada(s) correctamente.`
                        );
                      }

                      // Limpiar notas y observaciones solo si todo fue exitoso
                      if (errores.length === 0) {
                        setNotas({});
                        setObservaciones({});
                        setAlumnoEnEdicion(null);
                      }
                    } catch (err) {
                      console.error("Error guardando calificaciones:", err);
                      alert(
                        "Error al guardar calificaciones. Revisa la consola para más detalles."
                      );
                    } finally {
                      setGuardando(false);
                    }
                  }}
                >
                  {guardando ? "Guardando..." : "Guardar"}
                </Botón>
                <Botón
                  variante="secondary"
                  disabled={guardando}
                  onClick={() => {
                    setNotas({});
                    setObservaciones({});
                  }}
                >
                  Limpiar Todo
                </Botón>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Editar-Calificaciones */}
        {vistaActual === "editarCalificaciones" && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Editar Calificaciones
              </h2>
              <Botón
                variante="secondary"
                onClick={() => setVistaActual("dashboard")}
              >
                Volver al inicio
              </Botón>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Materia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Calificación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cargando ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          Cargando calificaciones...
                        </td>
                      </tr>
                    ) : calificacionesList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No hay calificaciones registradas
                        </td>
                      </tr>
                    ) : (
                      calificacionesList.map((c) => (
                        <tr key={c.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {c.alumno_nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {c.grupo || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {c.materia_nombre || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              disabled={!editableMap[c.id]}
                              value={c.nota !== null ? String(c.nota) : ""}
                              onChange={(e) => {
                                const val =
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value);
                                setCalificacionesList((s) =>
                                  s.map((item) =>
                                    item.id === c.id
                                      ? { ...item, nota: val }
                                      : item
                                  )
                                );
                              }}
                              className={`border border-gray-300 rounded px-3 py-1 w-20 focus:outline-none ${editableMap[c.id] ? "focus:ring-2 focus:ring-blue-500" : "bg-gray-100"}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              disabled={!editableMap[c.id]}
                              value={c.observaciones ?? ""}
                              onChange={(e) =>
                                setCalificacionesList((s) =>
                                  s.map((item) =>
                                    item.id === c.id
                                      ? {
                                          ...item,
                                          observaciones: e.target.value,
                                        }
                                      : item
                                  )
                                )
                              }
                              className={`border border-gray-300 rounded px-3 py-1 w-full focus:outline-none ${
                                editableMap[c.id]
                                  ? "focus:ring-2 focus:ring-blue-500"
                                  : "bg-gray-100"
                              }`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {!editableMap[c.id] ? (
                              <Botón
                                variante="primary"
                                onClick={() =>
                                  setEditableMap((m) => ({
                                    ...m,
                                    [c.id]: true,
                                  }))
                                }
                              >
                                Modificar
                              </Botón>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Botón
                                  variante="primary"
                                  onClick={async () => {
                                    try {
                                      setGuardando(true);
                                      await api.patch(
                                        `/maestro/calificaciones/${c.id}`,
                                        {
                                          nota: c.nota,
                                          observaciones: c.observaciones,
                                        }
                                      );
                                      // actualizar snapshot
                                      setOriginalCalificaciones((orig) => ({
                                        ...orig,
                                        [String(c.id)]: { ...c },
                                      }));
                                      setEditableMap((m) => ({
                                        ...m,
                                        [c.id]: false,
                                      }));
                                      alert("Calificación actualizada");
                                    } catch (err) {
                                      console.error(
                                        "Error actualizando calificación:",
                                        err
                                      );
                                      alert("Error al actualizar calificación");
                                    } finally {
                                      setGuardando(false);
                                    }
                                  }}
                                >
                                  Guardar
                                </Botón>

                                <Botón
                                  variante="secondary"
                                  onClick={() => {
                                    // revertir cambios desde snapshot
                                    const orig =
                                      originalCalificaciones[String(c.id)];
                                    if (orig) {
                                      setCalificacionesList((s) =>
                                        s.map((item) =>
                                          item.id === c.id ? { ...orig } : item
                                        )
                                      );
                                    }
                                    setEditableMap((m) => ({
                                      ...m,
                                      [c.id]: false,
                                    }));
                                  }}
                                >
                                  Cancelar
                                </Botón>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
