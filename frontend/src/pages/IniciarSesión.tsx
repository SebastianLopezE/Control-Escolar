import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAutenticacion";
import { Botón } from "../components/common/Botón";
import { Entrada } from "../components/common/Entrada";

export function IniciarSesión() {
  const navigate = useNavigate();
  const { iniciarSesion, estaCargando, error } = useAutenticacion();
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errorLocal, setErrorLocal] = useState("");

  // 2. Maneja el envío del formulario de inicio de sesión
  const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    setErrorLocal("");

    if (!email || !contraseña) { 
      setErrorLocal("Por favor completa todos los campos");
      return;
    }

    try {
      // se llama a la funcion de iniciar sesión del contexto (contextAutenticacion)
      await iniciarSesion(email, contraseña);
      navigate("/dashboard");
    } catch (err) {
      setErrorLocal(error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Control Escolar
        </h1>

        {(errorLocal || error) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-medium">{errorLocal || error}</p>
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-6">
          <Entrada
            etiqueta="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Entrada
            etiqueta="Contraseña"
            type="password"
            placeholder="••••••••"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <Botón
            variante="primary"
            tamaño="grande"
            estaCargando={estaCargando}
            className="w-full flex justify-center items-center"
          >
            Iniciar Sesión
          </Botón>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Para crear cuentas contacta al área de Control Escolar.</p>
        </div>
      </div>
    </div>
  );
}
