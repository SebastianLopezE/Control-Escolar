import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Botón } from "../components/common/Botón";
import { Entrada } from "../components/common/Entrada";

// Materias disponibles (fijas) - deben coincidir con los códigos en la BD
const MATERIAS_DISPONIBLES = [
  { codigo: "matematicas", nombre: "Matemáticas" },
  { codigo: "quimica", nombre: "Química" },
  { codigo: "español", nombre: "Español" },
];

// Grupos disponibles (fijos)
const GRUPOS_DISPONIBLES = [
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

export function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [rol, setRol] = useState("maestro");
  const [materias, setMaterias] = useState<
    { id: number; nombre: string; codigo?: string }[]
  >([]);
  const [materiaId, setMateriaId] = useState("");
  const [grupo, setGrupo] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);
  const [error, setError] = useState("");

  // Cargar materias desde API y filtrar solo las permitidas
  useEffect(() => {
    const obtenerMaterias = async () => {
      try {
        const resp = await api.get("/materias");
        const todasMaterias = resp.data?.datos || [];

        // Filtrar solo las materias permitidas (QIM, ESP)
        const codigosPermitidos = MATERIAS_DISPONIBLES.map((m) => m.codigo);
        const materiasFiltradas = todasMaterias.filter((mat: any) =>
          codigosPermitidos.includes(mat.codigo)
        );

        setMaterias(materiasFiltradas);
      } catch (err) {
        console.error("No se pudieron cargar las materias", err);
        setMaterias([]);
      }
    };

    obtenerMaterias();
  }, []);

  const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !contraseña || !confirmarContraseña) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setEstaCargando(true);

      const respuestaRegistro = await api.post("/auth/registro", {
        nombre,
        email,
        password: contraseña,
        rol,
      });

      // Si es maestro y seleccionó materia/grupo, crear la asignación de curso
      if (rol === "maestro" && materiaId && grupo) {
        const { token, usuario } = respuestaRegistro.data || {};
        if (token) {
          localStorage.setItem("token", token);
        }

        await api.post("/maestro/cursos", {
          maestro_id: usuario?.id,
          materia_id: Number(materiaId),
          grupo_nombre: grupo,
        });

        // Limpia el token para que el usuario inicie sesión normalmente
        localStorage.removeItem("token");
      }

      setEstaCargando(false);
      navigate("/iniciar-sesion");
    } catch (err: any) {
      const mensaje = err?.response?.data?.error || "Error al registrar";
      setError(mensaje);
      setEstaCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Control Escolar
        </h1>
        <p className="text-center text-gray-600 mb-8">Crear nueva cuenta</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-4">
          <Entrada
            etiqueta="Nombre Completo"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <Entrada
            etiqueta="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="grupo-formulario">
            <label className="block text-gray-700 font-semibold mb-2">
              Rol <span className="requerido">*</span>
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded text-base font-sans bg-white focus:outline-none focus:border-blue-600"
              required
            >
              <option value="maestro">Maestro</option>
              <option value="control_escolar">Control Escolar</option>
            </select>
          </div>

          {rol === "maestro" && (
            <>
              <div className="grupo-formulario">
                <label className="block text-gray-700 font-semibold mb-2">
                  Materia que impartes <span className="requerido">*</span>
                </label>
                <select
                  value={materiaId}
                  onChange={(e) => setMateriaId(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded text-base font-sans bg-white focus:outline-none focus:border-blue-600"
                  required
                >
                  <option value="">Selecciona una materia</option>
                  {materias.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grupo-formulario">
                <label className="block text-gray-700 font-semibold mb-2">
                  Grupo <span className="requerido">*</span>
                </label>
                <select
                  value={grupo}
                  onChange={(e) => setGrupo(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded text-base font-sans bg-white focus:outline-none focus:border-blue-600"
                  required
                >
                  <option value="">Selecciona un grupo</option>
                  {GRUPOS_DISPONIBLES.map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <Entrada
            etiqueta="Contraseña"
            type="password"
            placeholder="••••••••"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <Entrada
            etiqueta="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            required
          />

          <Botón
            variante="primary"
            tamaño="grande"
            estaCargando={estaCargando}
            className="w-full flex justify-center items-center"
          >
            Registrarse
          </Botón>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/iniciar-sesion")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
