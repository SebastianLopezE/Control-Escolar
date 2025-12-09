import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import { Botón } from "../../components/common/Botón";
import api from "../../services/api";

export function ControlEscolarDashboard() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAutenticacion();
  const [vistaActual, setVistaActual] = useState<
    "dashboard" | "alumnos" | "reportes" | "crear" | "asignar"
  >("dashboard");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoCrear, setTipoCrear] = useState<"maestro" | "alumno">("maestro");
  const [grupoNombre, setGrupoNombre] = useState("");
  const [maestrosList, setMaestrosList] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [materiasList, setMateriasList] = useState<
    { id: number; nombre: string }[]
  >([]);
  // Lista estática y conocida de grupos (evita dependencias externas si prefieres)
  const GRUPOS = [
    "1-A",
    "1-B",
    "1-C",
    "1-D",
    "2-A",
    "2-B",
    "2-C",
    "2-D",
    "3-A",
    "3-B",
    "3-C",
    "3-D",
  ];

  const [selectedMaestroNombre, setSelectedMaestroNombre] = useState("");
  const [selectedMateriaNombre, setSelectedMateriaNombre] = useState("");
  const [mensajeAccion, setMensajeAccion] = useState("");
  const [estaCargandoAccion, setEstaCargandoAccion] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [statsPromedios, setStatsPromedios] = useState<{
    promedio_general: number;
    promedios_por_alumno: Array<{
      alumno_id: number;
      alumno_nombre: string | null;
      promedio: number;
    }>;
    promedios_por_materia: Array<{
      materia_id: number;
      materia_nombre: string | null;
      promedio: number;
    }>;
  }>({
    promedio_general: 0,
    promedios_por_alumno: [],
    promedios_por_materia: [],
  });
  const [cargandoReportes, setCargandoReportes] = useState(false);
  const [calificacionesList, setCalificacionesList] = useState<
    Array<{
      id: number;
      alumno_nombre: string | null;
      alumno_matricula?: string | null;
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
      cargarCalificaciones();
    }
    if (vistaActual === "reportes") {
      cargarPromedios();
    }
  }, [vistaActual]);

  const cargarPromedios = async () => {
    try {
      setCargandoReportes(true);
      const resp = await api.get("/controlescolar/reporte-promedios");
      const datos = resp.data?.datos;
      setStatsPromedios({
        promedio_general: Number(datos?.promedio_general ?? 0),
        promedios_por_alumno: datos?.promedios_por_alumno || [],
        promedios_por_materia: datos?.promedios_por_materia || [],
      });
    } catch (err) {
      console.error("Error cargando promedios", err);
      setStatsPromedios({
        promedio_general: 0,
        promedios_por_alumno: [],
        promedios_por_materia: [],
      });
    } finally {
      setCargandoReportes(false);
    }
  };

  const cargarCalificaciones = async () => {
    try {
      setCargando(true);
      const resp = await api.get("/controlescolar/reporte");
      const datos = resp.data?.datos || [];

      const listaNormalizada = datos.map((d: any) => ({
        id: d.id,
        alumno_nombre: d.alumno_nombre || null,
        alumno_matricula: d.alumno_matricula || null,
        grupo: d.grupo || null,
        materia_nombre: d.materia_nombre || null,
        nota: d.nota !== undefined && d.nota !== null ? Number(d.nota) : null,
        observaciones: d.observaciones || null,
      }));

      setCalificacionesList(listaNormalizada);

      const snap: Record<string, any> = {};
      const editMap: Record<number, boolean> = {};
      listaNormalizada.forEach((item: any) => {
        snap[String(item.id)] = { ...item };
        editMap[item.id] = false;
      });

      setOriginalCalificaciones(snap);
      setEditableMap(editMap);
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
      setCalificacionesList([]);
      setEditableMap({});
      setOriginalCalificaciones({});
    } finally {
      setCargando(false);
    }
  };

  const cargarMaestros = async () => {
    try {
      const resp = await (
        await import("../../services/api")
      ).default.get("/controlescolar/maestros");
      setMaestrosList(resp.data.datos || []);
    } catch (err) {
      console.error("No se pudieron cargar maestros", err);
      setMaestrosList([]);
    }
  };

  const cargarMaterias = async () => {
    try {
      const api = (await import("../../services/api")).default;
      const resp = await api.get("/materias");
      const lista = resp.data?.datos || [];
      // esperamos que cada materia tenga { id, nombre }
      setMateriasList(
        lista.map((m: any) => ({
          id: m.id,
          nombre: m.nombre || m.nombre_materia || m.codigo,
        }))
      );
    } catch (err) {
      console.error("No se pudieron cargar las materias", err);
      setMateriasList([]);
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
          <h1 className="text-white text-2xl font-bold">
            Panel de Control Escolar
          </h1>
          <div className="space-x-4">
            <span className="text-white">
              {usuario?.nombre || "Administrador"}
            </span>
            <Botón variante="secondary" onClick={manejarCerrarSesion}>
              Cerrar Sesión
            </Botón>
          </div>
        </div>
      </div>

      <div className="contenedor-panel p-8">
        {vistaActual === "dashboard" && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Bienvenido, {usuario?.nombre}!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              <strong>Panel de Control Escolar</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto justify-items-center">
              {/* <div className="w-full md:w-[320px] bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  Gestión de Calificaciones
                </h3>
                <p className="text-gray-600">
                  Elimina o modifica calificaciones
                </p>
              </div> */}
              <div
                onClick={() => setVistaActual("alumnos")}
                className="w-full md:w-[320px] bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  Gestión de Calificaciones
                </h3>
                <p className="text-gray-600">
                  Elimina o modifica calificaciones
                </p>
              </div>

              <div
                onClick={() => setVistaActual("reportes")}
                className="w-full md:w-[320px] bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  Reportes Generales
                </h3>
                <p className="text-gray-600">
                  ver reporte de promedio por alumno, materia o general
                </p>
              </div>
              <div
                onClick={() => setVistaActual("crear")}
                className="w-full md:w-[320px] bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  Registrar Usuarios
                </h3>
                <p className="text-gray-600">Crear maestros o alumnos</p>
              </div>

              <div
                onClick={() => {
                  setVistaActual("asignar");
                  cargarMaestros();
                  cargarMaterias();
                }}
                className="w-full md:w-[320px] bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-yellow-600 mb-3">
                  Asignar Cursos
                </h3>
                <p className="text-gray-600">
                  Asignar materia y grupo a maestros
                </p>
              </div>
            </div>
          </div>
        )}

        {vistaActual === "alumnos" && (
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
                              <div className="flex items-center space-x-2">
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
                                <Botón
                                  variante="danger"
                                  disabled={guardando}
                                  onClick={async () => {
                                    const confirmar = window.confirm(
                                      "¿Deseas eliminar esta calificación?"
                                    );
                                    if (!confirmar) return;
                                    try {
                                      setGuardando(true);
                                      await api.delete(
                                        `/controlescolar/calificaciones/${c.id}`
                                      );
                                      setCalificacionesList((s) =>
                                        s.filter((item) => item.id !== c.id)
                                      );
                                      alert("Calificación eliminada");
                                    } catch (err) {
                                      console.error(
                                        "Error eliminando calificación:",
                                        err
                                      );
                                      alert("Error al eliminar calificación");
                                    } finally {
                                      setGuardando(false);
                                    }
                                  }}
                                >
                                  Eliminar
                                </Botón>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Botón
                                  variante="primary"
                                  disabled={guardando}
                                  onClick={async () => {
                                    try {
                                      setGuardando(true);
                                      await api.patch(
                                        `/controlescolar/calificaciones/${c.id}`,
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
                                  disabled={guardando}
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

        {vistaActual === "crear" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Registrar Usuario
              </h2>
              <div>
                <Botón
                  variante="secondary"
                  onClick={() => setVistaActual("dashboard")}
                >
                  Volver al inicio
                </Botón>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Tipo</label>
                  <select
                    value={tipoCrear}
                    onChange={(e) => setTipoCrear(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="maestro">Maestro</option>
                    <option value="alumno">Alumno</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Nombre</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {tipoCrear === "maestro" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">Email</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Contraseña
                      </label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </>
                )}

                {tipoCrear === "alumno" && (
                  <>
                    <div>
                      <label className="block font-semibold mb-1">
                        Grupo (selecciona)
                      </label>
                      <select
                        value={grupoNombre}
                        onChange={(e) => setGrupoNombre(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Selecciona grupo</option>
                        {GRUPOS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Botón
                  variante="primary"
                  estaCargando={estaCargandoAccion}
                  onClick={async () => {
                    setEstaCargandoAccion(true);
                    setMensajeAccion("");
                    try {
                      const api = (await import("../../services/api")).default;
                      const payload: any = { tipo: tipoCrear, nombre };
                      if (tipoCrear === "maestro") {
                        payload.email = email;
                        payload.password = password;
                      } else {
                        // No enviamos matrícula; se generará automáticamente en el backend
                        payload.grupo_nombre = grupoNombre;
                      }
                      const resp = await api.post(
                        "/controlescolar/usuarios",
                        payload
                      );
                      setMensajeAccion(resp.data.mensaje || "Usuario creado");
                    } catch (err: any) {
                      console.error("Error crear usuario", err);
                      console.error(
                        "respuesta del servidor:",
                        err?.response?.data
                      );
                      setMensajeAccion(
                        err?.response?.data?.mensaje ||
                          JSON.stringify(err?.response?.data) ||
                          "Error al crear usuario"
                      );
                    } finally {
                      setEstaCargandoAccion(false);
                    }
                  }}
                >
                  Crear
                </Botón>
                <Botón
                  variante="secondary"
                  onClick={() => {
                    setNombre("");
                    setEmail("");
                    setPassword("");
                    setGrupoNombre("");
                    setMensajeAccion("");
                  }}
                >
                  Limpiar
                </Botón>
              </div>

              {mensajeAccion && (
                <p className="mt-4 text-sm text-gray-700">{mensajeAccion}</p>
              )}
            </div>
          </div>
        )}

        {vistaActual === "asignar" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Asignar Curso a Maestro
              </h2>
              <div>
                <Botón
                  variante="secondary"
                  onClick={() => setVistaActual("dashboard")}
                >
                  Volver al inicio
                </Botón>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Maestro</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedMaestroNombre}
                    onChange={(e) => {
                      setSelectedMaestroNombre(e.target.value);
                    }}
                  >
                    <option value="">Selecciona maestro</option>
                    {maestrosList.map((m) => (
                      <option key={m.id} value={m.nombre}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Materia</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedMateriaNombre}
                    onChange={(e) => setSelectedMateriaNombre(e.target.value)}
                  >
                    <option value="">Selecciona materia</option>
                    {materiasList.map((mat) => (
                      <option key={mat.id} value={mat.nombre}>
                        {mat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-semibold mb-1">
                    Grupo (selecciona)
                  </label>
                  <select
                    value={grupoNombre}
                    onChange={(e) => setGrupoNombre(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Selecciona grupo</option>
                    {GRUPOS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Botón
                  variante="primary"
                  estaCargando={estaCargandoAccion}
                  onClick={async () => {
                    setEstaCargandoAccion(true);
                    setMensajeAccion("");
                    try {
                      const api = (await import("../../services/api")).default;
                      // Resolver ids a partir de nombres seleccionados
                      const maestroEncontrado = maestrosList.find(
                        (m) => m.nombre === selectedMaestroNombre
                      );
                      const materiaEncontrada = materiasList.find(
                        (m) => m.nombre === selectedMateriaNombre
                      );
                      if (!maestroEncontrado)
                        throw new Error("Seleccione un maestro válido");
                      if (!materiaEncontrada)
                        throw new Error("Seleccione una materia válida");

                      const resp = await api.post(
                        "/controlescolar/asignar-curso",
                        {
                          maestro_id: maestroEncontrado.id,
                          materia_id: materiaEncontrada.id,
                          grupo_nombre: grupoNombre,
                        }
                      );
                      setMensajeAccion(resp.data.mensaje || "Curso asignado");
                    } catch (err: any) {
                      console.error("Error asignar curso", err);
                      console.error(
                        "respuesta del servidor:",
                        err?.response?.data
                      );
                      setMensajeAccion(
                        err?.response?.data?.mensaje ||
                          JSON.stringify(err?.response?.data) ||
                          "Error al asignar curso"
                      );
                    } finally {
                      setEstaCargandoAccion(false);
                    }
                  }}
                >
                  Asignar
                </Botón>
                <Botón
                  variante="secondary"
                  onClick={() => {
                    setGrupoNombre("");
                    setMensajeAccion("");
                    setSelectedMaestroNombre("");
                    setSelectedMateriaNombre("");
                  }}
                >
                  Limpiar
                </Botón>
              </div>

              {mensajeAccion && (
                <p className="mt-4 text-sm text-gray-700">{mensajeAccion}</p>
              )}
            </div>
          </div>
        )}

        {vistaActual === "reportes" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Reportes Estadísticos
              </h2>
              <Botón
                variante="secondary"
                onClick={() => setVistaActual("dashboard")}
              >
                Volver al inicio
              </Botón>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-grey-500 to-grey-600 text-white p-6 rounded-lg">
                  <p className="text-sm opacity-90">Promedio General</p>
                  <p className="text-4xl font-bold mt-2">
                    {cargandoReportes
                      ? "..."
                      : statsPromedios.promedio_general.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Promedio por Alumno
                </h3>
                {cargandoReportes ? (
                  <p className="text-gray-500">Cargando...</p>
                ) : statsPromedios.promedios_por_alumno.length === 0 ? (
                  <p className="text-gray-500">Sin datos</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Alumno
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Promedio
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {statsPromedios.promedios_por_alumno.map((a) => (
                          <tr key={a.alumno_id}>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {a.alumno_nombre || "Sin nombre"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {a.promedio.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Promedio por Materia
                </h3>
                {cargandoReportes ? (
                  <p className="text-gray-500">Cargando...</p>
                ) : statsPromedios.promedios_por_materia.length === 0 ? (
                  <p className="text-gray-500">Sin datos</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Materia
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Promedio
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {statsPromedios.promedios_por_materia.map((m) => (
                          <tr key={m.materia_id}>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {m.materia_nombre || "Sin nombre"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {m.promedio.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
