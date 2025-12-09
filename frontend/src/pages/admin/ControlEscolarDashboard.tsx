import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import { Botón } from "../../components/common/Botón";

interface UsuarioRegistrado {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fechaRegistro: string;
}

export function ControlEscolarDashboard() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAutenticacion();
  const [usuarios, setUsuarios] = useState<UsuarioRegistrado[]>([]);
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

  // Usamos lista estática `GRUPOS` en lugar de llamar al endpoint `/grupos`

  useEffect(() => {
    const usuariosGuardados = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );
    setUsuarios(usuariosGuardados);
  }, []);

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
              <div className="w-full md:w-[320px] bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Gestión de Usuarios
              </h2>
              <Botón
                variante="secondary"
                onClick={() => setVistaActual("dashboard")}
              >
                Volver al inicio
              </Botón>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-semibold">
                    Total Usuarios
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {usuarios.length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-semibold">
                    Maestros
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {usuarios.filter((u) => u.rol === "maestro").length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold">
                    Control Escolar
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {usuarios.filter((u) => u.rol === "control_escolar").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((usr) => (
                      <tr key={usr.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {usr.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {usr.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usr.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              usr.rol === "maestro"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {usr.rol === "maestro"
                              ? "Maestro"
                              : "Control Escolar"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(usr.fechaRegistro).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                      // actualizar lista local
                      const stored = JSON.parse(
                        localStorage.getItem("usuarios") || "[]"
                      );
                      const nuevoStored = [
                        {
                          id: resp.data.datos.id,
                          nombre: resp.data.datos.nombre,
                          email: resp.data.datos.email || "",
                          rol: tipoCrear,
                        },
                        ...stored,
                      ];
                      localStorage.setItem(
                        "usuarios",
                        JSON.stringify(nuevoStored)
                      );
                      // Actualizar estado para que la tabla se refresque inmediatamente
                      setUsuarios(nuevoStored);
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
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Estadísticas del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">Usuarios Totales</p>
                    <p className="text-4xl font-bold mt-2">{usuarios.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">Usuarios Activos Hoy</p>
                    <p className="text-4xl font-bold mt-2">1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
