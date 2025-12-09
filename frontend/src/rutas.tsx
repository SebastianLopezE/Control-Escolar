import { createBrowserRouter, Navigate } from "react-router-dom";
import { IniciarSesión } from "./pages/IniciarSesión";
import { Registro } from "./pages/Registro";
import { RedireccionDashboard } from "./pages/RedireccionDashboard";
import { RutaPrivada } from "./components/RutaPrivada";
import { MaestroDashboard } from "./pages/maestro/MaestroDashboard";
import { ControlEscolarDashboard } from "./pages/admin/ControlEscolarDashboard";

export const router = createBrowserRouter([
  {
    path: "/iniciar-sesion",
    element: <IniciarSesión />,
  },
  // Ruta de registro público deshabilitada. Mantener el componente en el proyecto
  // Si alguien intenta acceder redirigimos al login
  {
    path: "/registro",
    element: <Navigate to="/iniciar-sesion" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <RutaPrivada>
        <RedireccionDashboard />
      </RutaPrivada>
    ),
  },
  {
    path: "/maestro/dashboard",
    element: (
      <RutaPrivada>
        <MaestroDashboard />
      </RutaPrivada>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <RutaPrivada>
        <ControlEscolarDashboard />
      </RutaPrivada>
    ),
  },
  {
    path: "/no-autorizado",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            No tienes permisos
          </h1>
          <p className="text-gray-600 mb-8">
            No estás autorizado para acceder a esta página
          </p>
          <a href="/dashboard" className="boton boton-primario">
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/iniciar-sesion" replace />,
  },
]);
